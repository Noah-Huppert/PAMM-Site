"use strict";

var rekuire = require("rekuire");

var ArgValidator = rekuire("ArgValidator");

function AppError(code, description){
  var self = this;

  if(!ArgValidator.checkArg(code, "number")){
    throw "code must be defined and a number";
  }

  if(!ArgValidator.checkArg(description, "string")){
    throw "description must be defined and a string";
  }

  self.code = code;
  self.description = description;
}

module.exports = AppError;
