"use strict";

var rekuire = require("rekuire");
var _ = require("underscore");
var uuid = require("node-uuid");
var request = require("request");

var config = rekuire("../config");
var PGQuery = rekuire("PGQuery");
var Route = rekuire("Route");

request = request.defaults(config.npm.request);

module.exports = function(express, app, argv, pgClient){
  var siteUrl = argv.dev ? "http://127.0.0.1:9000" : "https://pamm-site.herokuapp.com/";

  var routers = {
    api: {
      router: express.Router(),
      v1: {
        router: express.Router(),
        auth: {
          router: express.Router()
        }
      }
    }
  };

  app.use(config.api.root, routers.api.router);
  routers.api.router.use(config.api.v1.root, routers.api.v1.router);
  routers.api.v1.router.use(config.api.v1.auth.root, routers.api.v1.auth.router);

  //Authetication
  new Route.Route(routers, "api.v1.auth.connect", "get", function(req, res){
    var state = uuid.v4();

    res.cookie("state", state);

    res.redirect(config.github.api.connect +
      "?client_id=" + config.secrets.github.clientId +
      "&redirect_uri=" + siteUrl + Route.getRoutePath("api.v1.auth.oauthCallback") +
      "&scope=repo" +
      "&state=" + state);
  });

  new Route.Route(routers, "api.v1.auth.oauthCallback", "get", "Route_ApiV1AuthOAuthCallback", { pgClient: pgClient });//TODO Delete access tokens

  new Route.Route(routers, "api.v1.auth.accessToken", "get", function(req, res){
    //TODO Implement api.v1.auth.accessToken
  });
};
