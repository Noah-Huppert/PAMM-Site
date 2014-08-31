/* Setup namespace */
var pamm = {};
pamm.deps = {};
pamm.helpers = {};
pamm.config = {};
pamm.models = {};
pamm.controllers = {};

pamm.controllers.githubApi = {};


/* Nodejs require */
pamm.deps.url = require("url");
pamm.deps.uuid = require("node-uuid");
pamm.deps.request = require("request");
//pamm.deps.http = require("http");

/* App require */
pamm.config = rekuire("config/app");
pamm.helpers.merge = rekuire("helpers/mergeHelper");
pamm.models.userSession = rekuire("models/userSessionModel");
pamm.models.githubApiToken = rekuire("models/githubApiTokenModel");


pamm.controllers.githubApi.assembleUrl = function(data, givenFlags){
  /*
  flag = site
  flag = github
  flag = githubPlain
  flag = api
  flag = apiPlain
  */

/*
  switch(flag){
    case "site":
      toReturn = pamm.config.app.siteUrl + urlId;
      break;
    case "github":
      var githubBaseUrl = pamm.config.app.github.api.urls.base.url;
      var githubUrls = pamm.config.app.github.api.urls;
      toReturn = githubUrls[urlId] !== undefined ? githubBaseUrl + githubUrls[urlId].url : githubBaseUrl;
      break;
    case "githubPlain":
      var githubPlainUrls = pamm.config.app.github.api.urls;
      toReturn = githubPlainUrls[urlId] !== undefined ? githubPlainUrls[urlId].url : "";
      break;
    case "githubObject":
        var githubObjectUrls = pamm.config.app.github.api.urls;
        toReturn = githubPlainUrls[urlId] !== undefined ? githubObjectUrls : { "url": "", "method": "" };
        break;
    case "api":
      var apiUrls = pamm.config.app.api.urls;
      toReturn = apiUrls[urlId] !== undefined ? pamm.config.app.siteUrl + apiUrls[urlId] : pamm.config.app.siteUrl;
      break;
    case "apiPlain":
      var apiPlainUrls = pamm.config.app.api.urls;
      toReturn = apiPlainUrls[urlId] !== undefined ? "/" + apiPlainUrls[urlId] : "/";
      break;
    }
*/

  /* Flags
  githubApi - Makes urlHost githubApi base, Makes urlObject from githubApi source
  site - Makes urlHost site base, makes urlObject data
  siteApi - Makes urlHost null, makes urlObject data

  plain - Makes urlSource null, makes urlObject data
  object - Makes urlHost null, returns url object
  */

  var flags = givenFlags.split(" ");

  var urlHost = "";
  var urlObject = { "method": "GET", "url": "" };

  for(var i = 0; i < flags.length; i++){
    var flag = flags[i];

    switch(flag){
      case "githubApi":
        urlHost = pamm.config.app.github.api.urls.base.url;
        urlObject = pamm.config.app.github.api.urls[data];
        break;
      case "site":
        urlHost = pamm.config.app.siteUrl;
        urlObject = { "method": "GET", "url": data };
        break;
      case "siteApi":
        urlHost = pamm.config.app.siteUrl.substring(0, pamm.config.app.siteUrl.length - 1);
        urlObject = { "method": "GET", "url": pamm.config.app.api.urls[data] };
      break;
    }
  }

  if(flags.indexOf("plain") !== -1){
    toReturn = urlObject.url;
  } else if(flags.indexOf("object") !== -1){
    toReturn = urlObject;
  } else{
    toReturn = urlHost + urlObject.url;
  }

  return toReturn;
};

pamm.controllers.githubApi.assembleOptions = function(urlObject, headers){
  var url = pamm.deps.url.parse(urlObject.url);

  if(headers === undefined){//No headers provided
    headers = {};
  }

  var options = {
    "url": pamm.deps.url.format(url),
    "method": urlObject.method,
    "headers": pamm.helpers.merge.do(pamm.config.app.github.headers, headers)
  };

  return options;
};

pamm.controllers.githubApi.assembleQueryParams = function(baseUrl, queryOptions, asObject){
  var url = pamm.deps.url.parse(baseUrl);

  url.query = queryOptions;

  if(asObject !== undefined && asObject){
    return { "method": "GET", "url": pamm.deps.url.format(url) };
  } else{
    return pamm.deps.url.format(url);
  }
};

pamm.controllers.githubApi.makeRequest = function(urlObject, headers, callback){
  var url = pamm.deps.url.parse(urlObject.url);

  if(typeof headers === "function"){//No headers provided
    callback = headers;
    headers = {};
  }

  var options = {
    "url": pamm.deps.url.format(url),
    "method": urlObject.method,
    "headers": pamm.helpers.merge.do(pamm.config.app.github.headers, headers)
  };

  pamm.deps.request(options, callback);

  /*var url = pamm.deps.url.parse(urlObject.url);

  if(typeof headers === "function"){//No headers provided
    callback = headers;
    headers = {};
  }

  var options = {
    "host": url.host,
    "path": url.path,
    "method": urlObject.method,
    "headers": pamm.helpers.merge.do(pamm.config.app.github.headers, headers)
  };

  pamm.deps.http.request(options, function(res){
    var response = "";

    res.on("data", function(data){
      response += data;
    });

    var req = res.on("end", function(){
      var data = {};

      if(response.length !== 0){
        data = JSON.parse(response);
      }

      callback(JSON.parse(data), res, err);
    });


    req.on('error', function(err) {
      callback(undefined, undefined, err);
    });

  });*/
};

pamm.controllers.githubApi.init = function(app){
  app.get(pamm.controllers.githubApi.assembleUrl("startAuthorization", "siteApi plain"), function(req, res){
    var authorizeUrl = pamm.controllers.githubApi.assembleUrl("authorize", "githubApi object");

    var state = pamm.deps.uuid.v4();

    var queryParams = {
      "client_id": pamm.config.secrets.github.clientId,
      "scopes": pamm.config.app.github.scopes,
      "redirect_uri": pamm.controllers.githubApi.assembleUrl("redirectUri", "siteApi"),
      "state": state
    };

    res.redirect(pamm.controllers.githubApi.assembleQueryParams(authorizeUrl.url, queryParams));
    //res.json({ "url": pamm.deps.url.format(url), "query": url.query});
  });

  app.get(pamm.controllers.githubApi.assembleUrl("redirectUri", "siteApi plain"), function(req, res){

    var getAccessTokenUrlObject = pamm.controllers.githubApi.assembleUrl("getAccessToken", 'githubApi object');

    var queryParams = {
      "client_id": pamm.config.secrets.github.clientId,
      "client_secret": pamm.config.secrets.github.clientSecret,
      "code": req.query.code,
      "redirect_uri": pamm.controllers.githubApi.assembleUrl("redirectUri", "siteApi")
    };

    var url = pamm.controllers.githubApi.assembleQueryParams(getAccessTokenUrlObject.url, queryParams, true);

    var callback = function(err, response, body){
      if(response.statusCode === 200){
        var data = JSON.parse(body);

        var githubApiToken = new pamm.models.githubApiToken(data.access_token, data.token_type, data.scope);
        githubApiToken.serialize(githubApiTokenSerlialized);
      }
    };

    var githubApiTokenSerlialized = function(err, data, unique, githubApiToken){
      var userSession = new pamm.models.userSession();
      userSession.serialize(userSessionSerialized);
    };

    var userSessionSerialized = function(err, data, unique, userSession){
      req.session.userSession = userSession.dump();
      res.redirect(pamm.config.app.siteUrl);
    };

    var options = pamm.controllers.githubApi.assembleOptions(url);

    pamm.deps.request.post(options, callback);
  });

  app.get("/", function(req, res){
    res.json(req.session);
  });

  return pamm.controllers.githubApi;
};

/* Export */
module.exports = pamm.controllers.githubApi;
