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
pamm.controllers.database = rekuire("controllers/databaseController");
pamm.helpers.merge = rekuire("helpers/mergeHelper");
pamm.models.userSession = rekuire("models/userSessionModel");
pamm.models.githubApiToken = rekuire("models/githubApiTokenModel");
pamm.models.user = rekuire("models/userModel");


pamm.controllers.githubApi.assembleUrl = function(data, givenFlags){
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

  if(flags.indexOf("object") === -1 && flags.indexOf("plain") !== -1){//!object plain
    toReturn = urlObject.url;
  } else if(flags.indexOf("object") !== -1){//object *
    var newObject = {
      "method": urlObject.method,
      "url": flags.indexOf("plain") !== -1 ? urlObject.url : urlHost + urlObject.url
    };

    toReturn = newObject;
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
};

pamm.controllers.githubApi.auth = function(req, callback){
  var userSession = req.session.userSession;

  if(userSession === undefined){
    callback(false, undefined, undefined);
    return;
  }

  var userSessionModel = new pamm.models.userSession();

  userSessionModel.deserialize(userSession);

  function foundUserSession(err, data){
    if(data[0] !== undefined){
      if(userSessionModel.userId === data[0].userId &&
        userSessionModel.userSessionId === data[0].userSessionId &&
        userSessionModel.userSessionSecret === data[0].userSessionSecret){

          pamm.controllers.database.findAsArray(pamm.config.app.database.usersCollection, { "userId": userSession.userId }, gotUserData);
        } else{
          callback(false, userSessionModel, undefined);
        }
    } else{
      callback(false, userSessionModel, undefined);
    }
  }

  function gotUserData(err, data){
    var userModel = new pamm.models.user();

    userModel.deserialize(data[0]);

    callback(true, userSessionModel, userModel);
  }

  pamm.controllers.database.findAsArray(pamm.config.app.database.userSessionsCollection, { "userSessionId": userSessionModel.userSessionId }, foundUserSession);
};

pamm.controllers.githubApi.init = function(app){
  app.get(pamm.controllers.githubApi.assembleUrl("startAuthorization", "siteApi plain"), function(req, res){
    var authorizeUrl = pamm.controllers.githubApi.assembleUrl("authorize", "githubApi object plain");

    var state = pamm.deps.uuid.v4();

    var queryParams = {
      "client_id": pamm.config.secrets.github.clientId,
      "scopes": pamm.config.app.github.scopes,
      "redirect_uri": pamm.controllers.githubApi.assembleUrl("redirectUri", "siteApi"),
      "state": state
    };

    res.redirect(pamm.controllers.githubApi.assembleQueryParams(authorizeUrl.url, queryParams));
  });

  app.get(pamm.controllers.githubApi.assembleUrl("redirectUri", "siteApi plain"), function(req, res){
    var user = {
      "userId": undefined,
      "userPermissions": []
    };

    var githubApiToken = {
      "userId": undefined,
      "accessToken": undefined,
      "tokenType": undefined,
      "scope": undefined
    };

    /* Get Access Token */
    var getAccessTokenEntryPointUrl = pamm.controllers.githubApi.assembleUrl("getAccessToken", "githubApi plain");
    var getAccessTokenQueryParams = {
      "client_id": pamm.config.secrets.github.clientId,
      "client_secret": pamm.config.secrets.github.clientSecret,
      "code": req.query.code,
      "redirect_uri": pamm.controllers.githubApi.assembleUrl("redirectUri", "siteApi")
    };
    var getAccessTokenUrlObject = pamm.controllers.githubApi.assembleQueryParams(getAccessTokenEntryPointUrl, getAccessTokenQueryParams, true);
    var getAccessTokenRequestOptions = pamm.controllers.githubApi.assembleOptions(getAccessTokenUrlObject);
    function getAccessTokenRequestComplete(err, response, body){
      if(response.statusCode === 200){
        var data = JSON.parse(body);

        githubApiToken.accessToken = data.access_token;
        githubApiToken.tokenType = data.token_type;
        githubApiToken.scope = data.scope;

        getUserInfo();
      } else{
        res.json({ "error": body});
      }
    }
    pamm.deps.request.post(getAccessTokenRequestOptions, getAccessTokenRequestComplete);


    /* Get User data */
    function getUserInfo(){
      var getUserInfoEntryPointUrlObject = pamm.controllers.githubApi.assembleUrl("getUserInfo", "githubApi object");
      var getUserInfoHeaders = {
        "Authorization": "token " + githubApiToken.accessToken
      };
      var getUserInfoOptions = pamm.controllers.githubApi.assembleOptions(getUserInfoEntryPointUrlObject, getUserInfoHeaders);
      pamm.deps.request.get(getUserInfoOptions, getUserInfoRequestComplete);
    }

    function getUserInfoRequestComplete(err, response, body){
      if(response.statusCode === 200){
        var data = JSON.parse(body);

        githubApiToken.userId = data.id;
        user.userId = data.id;

        saveUserData();
      } else{
        res.json({ "error": body});
      }
    }


    /* Save all data */
    function saveUserData(){
      var userModel = new pamm.models.user(user.userId);
      userModel.serialize(saveGithubApiToken);
    }

    function saveGithubApiToken(err, data, unique, userModel){
      var githubApiTokenModel = new pamm.models.githubApiToken(user.userId, githubApiToken.accessToken, githubApiToken.tokenType, githubApiToken.scope);
      githubApiTokenModel.serialize(createAndSaveUserSession);
    }

    function createAndSaveUserSession(err, data, unique, githubApiTokenModel){
      var userSessionModel = new pamm.models.userSession(user.userId);
      userSessionModel.serialize(storeUserSessionInSession);
    }

    function storeUserSessionInSession(err, data, unique, userSessionModel){
      req.session.userSession = userSessionModel.dump();
      redirectToHomePage();
    }


    /* Redirect to home page */
    function redirectToHomePage(){
      res.redirect(pamm.controllers.githubApi.assembleUrl("", "site"));
    }

  });
};

/* Export */
module.exports = pamm.controllers.githubApi;
