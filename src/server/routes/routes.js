"use strict";

var rekuire = require("rekuire");
var request = require("request");

var config = rekuire("../config");
var Route = rekuire("Route");

request = request.defaults(config.npm.request);

module.exports = function(express, app, argv, pgClient){
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
  new Route.Route(routers, "api.v1.auth.connect", "get", "Route_ApiV1AuthConnect");

  new Route.Route(routers, "api.v1.auth.oauthCallback", "get", "Route_ApiV1AuthOAuthCallback", { pgClient: pgClient });

  new Route.Route(routers, "api.v1.auth.accessToken", "get", "Route_ApiV1AuthAccessToken", { pgClient: pgClient });
};
