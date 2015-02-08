"use strict";

var rekuire = require("rekuire");

var AppError = rekuire("AppError");

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
        }
      }
    }
  }
};
