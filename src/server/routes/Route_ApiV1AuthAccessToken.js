var rekuire = require("rekuire");

var config = rekuire("../config");
var errors = rekuire("../errors");
var ArgValidator = rekuire("../ArgValidator");
var PGQuery = rekuire("../PGQuery");

function onGetAccessTokenQueryComplete(res, err, resultObj){
  if(err === undefined){
    var githubUserId = resultObj.rows[0];
    if(githubUserId === undefined){
      errors.returnWithError(res, errors.api.v1.auth.accessToken.noSuchAccessToken);
      return;
    }

    var responseData = {};
    responseData[config.db.tables.users.columns.githubId] = githubUserId;

    res.json(responseData);
    return;
  } else {
    errors.returnWithError(res, errors.api.v1.auth.accessToken.getAccessTokenSqlError);
    return;
  }
}

function routeHandler(req, res, options){
  if(!ArgValidator.checkArg(options.pgClient, "object")){
    throw "options.pgClient must be defined and an object";
  }

  var accessToken = req.query.access_token;
  if(accessToken === undefined){
    errors.returnWithError(res, errors.api.v1.auth.accessToken.badAccessToken);
    return;
  }

  var getAccessTokenQueryString = "SELECT <%= githubUserIdKey %> FROM <%= accessTokensTable %> WHERE <%= accessTokenKey %>='<%= accessToken %>' LIMIT 1";
  var getAccessTokenQueryData = {
    githubUserIdKey: config.db.tables.accessTokens.columns.githubUserId,
    accessTokensTable: config.db.table.accessTokens.name,
    accessTokenKey: config.db.table.accessTokens.columns.accessToken,
    accessToken: accessToken
  };

  new PGQuery(getAccessTokenQueryString, getAccessTokenQueryData, function(err, resultObj){
    onGetAccessTokenQueryComplete(res, err, resultObj);
  });
}

module.exports = routeHandler;
