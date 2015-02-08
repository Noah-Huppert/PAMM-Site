"use strict";

var rekuire = require("rekuire");
var _ = require("underscore");

var config = rekuire("../config");
var ArgValidator = rekuire("../ArgValidator");

function getRoutePath(configKey){
  var configKeys = configKey.split(".");
  var parentKeys = configKeys.slice(0, configKeys.length - 1);
  var childKey = configKeys[configKeys.length - 1];

  //Get path
  var path = "";
  var pathTraverser = config;

  _.each(parentKeys, function(key){
    pathTraverser = pathTraverser[key];
    path += pathTraverser.root;
  });

  return path + pathTraverser[childKey];
}

function Route(routersObj, configKeysString, httpMethod, routeHandler, routeHandlerOptions){
  var self = this;

  if(!ArgValidator.checkArg(routersObj, "object")){
    throw "routersObj must be defined and an object";
  }

  if(!ArgValidator.checkArg(configKeysString, "string")){
    throw "configKeysString must be defined and a string";
  }

  if(!ArgValidator.checkArg(httpMethod, "string")){
    throw "httpMethod must be defined and a string";
  }

  if(!ArgValidator.checkArg(routeHandler, "function") && !ArgValidator.checkArg(routeHandler, "string")){
    throw "routeHandler must be defined and a function or string";
  }

  httpMethod = httpMethod.toLowerCase();

  if(httpMethod !== "get" && httpMethod !== "put" && httpMethod !== "post" && httpMethod !== "delete"){
    throw "httpMethod must be \"get\", \"put\", \"post\" or \"delete\"";
  }

  self.configKeys = configKeysString.split(".");
  self.parentKeys = self.configKeys.slice(0, self.configKeys.length - 1);
  self.childKey = self.configKeys[self.configKeys.length - 1];

  //Get path
  self.pathTraverser = config;

  _.each(self.parentKeys, function(key){
    self.pathTraverser = self.pathTraverser[key];
  });

  self.path = self.pathTraverser[self.childKey];

  //Get router
  self.routerTraverser = routersObj;

  _.each(self.parentKeys, function(key){
    self.routerTraverser = self.routerTraverser[key];
  });

  self.router = self.routerTraverser.router;

  if(typeof routeHandler === "string"){
    var f = rekuire(routeHandler);
    routeHandler = function(req, res){
      f(req, res, routeHandlerOptions);
    };

  }

  self.router[httpMethod](self.path, routeHandler);
}

module.exports = {
  Route: Route,
  getRoutePath: getRoutePath
};
