"use strict";

var rekuire = require("rekuire");
var request = require("request");
var _ = require("underscore");
var uuid = require("node-uuid");

var config = rekuire("../config");
var errors = rekuire("../errors");
var Route = rekuire("Route");
var ArgValidator = rekuire("../ArgValidator");
var ServerUrl = rekuire("../ServerUrl");
var PGQuery = rekuire("../PGQuery");

request = request.defaults(config.npm.request);

function exchangeGHAuthCode(req, res, pgClient, githubAuthCode){
  if(!ArgValidator.checkArg(githubAuthCode, "string")){
    throw "githubAuthCode must be defined and be a string";
  }

  var exchangeOptions = {
    url: config.github.api.accessToken,
    form: {
      client_id: config.secrets.github.clientId,
      client_secret: config.secrets.github.clientSecret,
      code: githubAuthCode,
      redirect_uri: ServerUrl.fromReq(req) + Route.getRoutePath("api.v1.auth.oauthCallback")
    }
  };

  request.post(exchangeOptions, function(err, result, body){
    onExchangeGHAuthCodeRequestComplete(res, err, pgClient, result, body);
  });
}

function onExchangeGHAuthCodeRequestComplete(res, err, pgClient, result, body){
  if(result.statusCode === 200){
    var bodyData = JSON.parse(body);

    //Retrieve and check Github Access Token
    var githubAccessToken = bodyData.access_token;
    if(githubAccessToken === undefined){
      errors.redirectWithError(res, errors.api.v1.auth.oauthCallback.badAccessToken);
      return;
    }

    getGHUserLinkedWithGHAccessToken(res, pgClient, githubAccessToken);
  } else{
    errors.redirectWithError(res, errors.api.v1.auth.oauthCallback.authCodeExchangeFail);
  }
}

function getGHUserLinkedWithGHAccessToken(res, pgClient, githubAccessToken){
  if(!ArgValidator.checkArg(githubAccessToken, "string")){
    throw "githubAccessToken must be defined and be a string";
  }

  var requestUrlString = "<%= githubApiUserUrl %>?access_token=<%= githubAccessToken %>";
  var requestUrlTemplate = _.template(requestUrlString);
  var requestUrlData = {
    githubApiUserUrl: config.github.api.user,
    githubAccessToken: githubAccessToken
  };

  request.get(requestUrlTemplate(requestUrlData), function(err, result, body){
    onGetGHUserLinkedWithGHAccessTokenRequestComplete(res, pgClient, githubAccessToken, err, result, body);
  });
}

function onGetGHUserLinkedWithGHAccessTokenRequestComplete(res, pgClient, githubAccessToken, err, result, body){
  if(!ArgValidator.checkArg(githubAccessToken, "string")){
    throw "githubAccessToken must be defined and be a string";
  }

  if(result.statusCode === 200){
    var bodyData = JSON.parse(body);

    //Retrieve and check Github User Id
    var githubUserId = bodyData.login;
    if(githubUserId === undefined){
      errors.redirectWithError(res, errors.api.v1.auth.oauthCallback.badUserData);
      return;
    }

    createOrUpdateUser(res, pgClient, githubUserId, githubAccessToken);
  } else{
    errors.redirectWithError(res, errors.api.v1.auth.oauthCallback.badUserData);
  }
}

function createOrUpdateUser(res, pgClient, githubUserId, githubAccessToken){
  if(!ArgValidator.checkArg(pgClient, "object")){
    throw "pgClient must be defined and be an object";
  }

  if(!ArgValidator.checkArg(githubUserId, "string")){
    throw "githubUserId must be defined and be a string";
  }

  if(!ArgValidator.checkArg(githubAccessToken, "string")){
    throw "githubAccessToken must be defined and be a string";
  }

  var sqlUpdateQueryString = "UPDATE <%= usersTable %> SET " +
                                            "<%= githubAccessTokenKey %>='<%= githubAccessToken %>' " +
                                            "WHERE <%= githubIdKey %>='<%= githubId %>';";

  var sqlCreateQueryString = "INSERT INTO <%= usersTable %> " +
                                            "(<%= githubIdKey %>, <%=githubAccessTokenKey %>) " +
                                            "SELECT '<%= githubId %>', '<%= githubAccessToken %>' " +
                                            "WHERE NOT EXISTS ( " +
                                                "SELECT 1 FROM <%= usersTable %> " +
                                                "WHERE <%= githubIdKey %>='<%= githubId %>'" +
                                            ");";

  var sqlQueryString = sqlUpdateQueryString + sqlCreateQueryString;
  var sqlQueryData = {
    usersTable: config.db.tables.users.name,
    githubIdKey: config.db.tables.users.columns.githubId,
    githubAccessTokenKey: config.db.tables.users.columns.githubAccessToken,
    githubId: githubUserId,
    githubAccessToken: githubAccessToken
  };

  new PGQuery(sqlQueryString, sqlQueryData, pgClient, function(err, resultObject){
    onCreateOrUpdateUserQueryComplete(res, pgClient, githubUserId, err, resultObject);
  });
}

function onCreateOrUpdateUserQueryComplete(res, pgClient, githubUserId, err, resultObject){
  if(err === undefined){
    generateSiteAccessToken(res, pgClient, githubUserId);
  } else {
    errors.redirectWithError(res, errors.api.v1.auth.oauthCallback.createOrUpdateUserSQLError, {sqlErr: err});
  }
}

function generateSiteAccessToken(res, pgClient, githubUserId){
  var siteAccessToken = uuid.v4();

  var today = new Date();
  var accessTokenExpiresOn = new Date();
  accessTokenExpiresOn.setDate(today.getDate() + config.accessToken.lifetime);

  saveSiteAccessToken(res, pgClient, githubUserId, siteAccessToken, accessTokenExpiresOn);
}

function saveSiteAccessToken(res, pgClient, githubUserId, siteAccessToken, siteAccessTokenExpiresOn){
  if(!ArgValidator.checkArg(pgClient, "object")){
    throw "pgClient must be defined and be an object";
  }

  if(!ArgValidator.checkArg(githubUserId, "string")){
    throw "githubUserId must be defined and be a string";
  }

  if(!ArgValidator.checkArg(siteAccessToken, "string")){
    throw "siteAccessToken must be defined and be a string";
  }

  if(!ArgValidator.checkArg(siteAccessTokenExpiresOn, "object")){
    throw "siteAccessTokenExpiresOn must be defined and be a date";
  }

  var sqlQueryString = "INSERT INTO <%= accessTokensTable %> " +
                                                        "(<%= accessTokenKey %>, <%= githubUserIdKey %>, <%= expiresOnKey %>) " +
                                                        "SELECT '<%= accessToken %>', '<%= githubUserId %>', '<%= expiresOn %>'; " +
                        "SELECT expire_access_tokens();";

  var expiresOn = siteAccessTokenExpiresOn.getFullYear() + "-" +
                  siteAccessTokenExpiresOn.getMonth() + 1 + "-" +
                  siteAccessTokenExpiresOn.getDate() + " " +
                  siteAccessTokenExpiresOn.getHours() + ":" +
                  siteAccessTokenExpiresOn.getMinutes() + ":" +
                  siteAccessTokenExpiresOn.getSeconds();

  var sqlQueryData = {
    accessTokensTable: config.db.tables.accessTokens.name,
    accessTokenKey: config.db.tables.accessTokens.columns.accessToken,
    githubUserIdKey: config.db.tables.accessTokens.columns.githubUserId,
    expiresOnKey: config.db.tables.accessTokens.columns.expiresOn,
    accessToken: siteAccessToken,
    githubUserId: githubUserId,
    expiresOn: expiresOn
  };

  new PGQuery(sqlQueryString, sqlQueryData, pgClient, function(err, result, resultObj){
    onSaveSiteAccessTokenComplete(res, siteAccessToken, err, result, resultObj);
  });
}

function onSaveSiteAccessTokenComplete(res, siteAccessToken, err, result, resultObj){
  if(err === undefined){
    res.cookie(config.accessToken.cookieKey, siteAccessToken);
    res.redirect("/");
  } else{
    console.log(err);
    errors.redirectWithError(res, errors.api.v1.auth.oauthCallback.saveSiteAccessTokenSQLError);
  }
}

function routeHandler(req, res, options){
  if(options === undefined || !ArgValidator.checkArg(options.pgClient, "object")){
    throw "options.pgClient must be defined and an object";
  }

  //Check state
  if(req.cookies.state === req.query.state){//Good state
    res.clearCookie("state");

    //Retrive and check Github Auth Code
    var githubAuthCode = req.query.code;
    if(githubAuthCode === undefined){
      errors.redirectWithError(res, errors.api.v1.auth.oauthCallback.badAuthCode);
      return;
    }

    exchangeGHAuthCode(req, res, options.pgClient, githubAuthCode);
  } else{//Bad state
    res.clearCookie("state");
    errors.redirectWithError(res, errors.api.v1.auth.oauthCallback.badState);
  }
}

module.exports = routeHandler;
