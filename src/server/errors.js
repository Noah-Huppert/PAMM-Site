"use strict";

var rekuire = require("rekuire");
var _ = require("underscore");

var AppError = rekuire("AppError");
var log = rekuire("Log");

function redirectWithError(res, err, extras){
  if(extras === undefined){
    extras = {};
  }

  var meta = _.extend(extras, {
    errCode: err.code
  });

  log.error(err.description, meta);

  res.redirect("/?error=" + err.code);
}

function returnWithError(res, err, extras){
  if(extras === undefined){
    extras = {};
  }

  var meta = _.extend(extras, {
    errCode: err.code
  });

  log.error(err.description, meta);

  res.status(505);
  res.json(_.extend(err, extras));
}

module.exports = {
  api: {
    v1: {
      auth: {
        oauthCallback: {
          badState: new AppError(1, "A bad state was returned by Github"),
          badAuthCode: new AppError(2, "A bad Authorization Code was returned by Github"),
          authCodeExchangeFail: new AppError(3, "The Github Authrization Code exchange failed"),
          badAccessToken: new AppError(4, "A bad Access Token was returned by Github"),
          badUserData: new AppError(5, "Bad user data was returned by Github"),
          createOrUpdateUserSQLError: new AppError(6, "There was an error with the SQL query to create or update the user"),
          saveSiteAccessTokenSQLError: new AppError(7, "There was an error with the SQL query to create the site Access Token")
        },
        accessToken: {
          badAccessToken: new AppError(8, "A bad Access Token was given by client"),
          getAccessTokenSqlError: new AppError(9, "There was an error with the SQL query to get the Access Token"),
          noSuchAccessToken: new AppError(10, "The Access Token provided by the client does not exist")
        }
      }
    }
  },
  redirectWithError: redirectWithError,
  returnWithError: returnWithError
};
