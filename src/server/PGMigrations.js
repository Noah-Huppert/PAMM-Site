"use strict";

var rekuire = require("rekuire");
var _ = require("underscore");

var PGQuery = rekuire("PGQuery");
var config = rekuire("config");

module.exports = function(pgClient){
  //Create users table if non existant
  var usersTableCreateQuery = "CREATE TABLE IF NOT EXISTS <%= tableName %>(" +
                  "<%= githubId %> CHAR(50) PRIMARY KEY NOT NULL," +
                  "<%= githubAccessToken %> CHAR(50) NOT NULL)";

  var usersTableQueryData = _.extend({
    tableName: config.db.tables.users.name
  }, config.db.tables.users.columns);

  new PGQuery(usersTableCreateQuery, usersTableQueryData, pgClient, function(err) {
    if(err !== undefined){
      throw err;
    }
  });

  //Create access tokens table if non existant
  var accessTokensTableCreateQuery = "CREATE TABLE IF NOT EXISTS <%= tableName %>(" +
                        "<%= accessToken %> CHAR(50) PRIMARY KEY NOT NULL," +
                        "<%= githubUserId %> CHAR(50) NOT NULL," +
                        "<%= expiresOn %> TIMESTAMP NOT NULL)";

  var accessTokensTableCreateQueryData = _.extend({
    tableName: config.db.tables.accessTokens.name
  }, config.db.tables.accessTokens.columns);

  new PGQuery(accessTokensTableCreateQuery, accessTokensTableCreateQueryData, pgClient, function(err) {
    if(err !== undefined){
      throw err;
    }
  });

  //Create delete old Access Tokens trigger
  var expireAccessTokensQueryString = "CREATE OR REPLACE FUNCTION expire_access_tokens() RETURNS void " +
                                              "LANGUAGE plpgsql " +
                                              "AS $$ " +
                                      "BEGIN " +
                                              "DELETE FROM <%= accessTokensTable %> WHERE <%= expiresOnKey %> < current_timestamp - INTERVAL '2 weeks'; " +
                                      "END; " +
                                      "$$;";

  var expireAccessTokenQueryData = {
    accessTokensTable: config.db.tables.accessTokens.name,
    expiresOnKey: config.db.tables.accessTokens.columns.expiresOn
  };

  new PGQuery(expireAccessTokensQueryString, expireAccessTokenQueryData, pgClient, function(err){
    if(err !== undefined){
      throw err;
    }
  });
};
