"use strict";

var _ = require("underscore");

function checkArg(arg, type) {
  if (arg === undefined) {
    return false;
  } else if (type !== undefined && typeof arg !== type) {
    return false;
  }

  return true;
}

function checkOptionalArg(arg, type) {
  if (arg !== undefined && typeof arg !== type) {
    return false;
  }

  return true;
}

function PGQuery(queryString, queryStringOptions, pgClient, onDoneCallback, onRowCallback, onErrorCallback) {
  var self = this;

  //Check args
  if (!checkArg(queryString, "string")) {
    throw "queryString must be defined and a string";
  }

  if (!checkArg(queryStringOptions, "object")) {
    queryStringOptions = {};
  }

  if (!checkArg(pgClient)) {
    throw "pgClient must be define";
  }

  if (!checkOptionalArg(onDoneCallback, "function")) {
    throw "onDoneCallback must be a function";
  }

  if (!checkOptionalArg(onRowCallback, "function")) {
    throw "onRowCallback must be a function";
  }

  if (!checkOptionalArg(onErrorCallback, "function")) {
    throw "onErrorCallback must be a function";
  }

  self._onDoneCallback = function(resultObj) {
    if (onDoneCallback !== undefined) {
      onDoneCallback(undefined, resultObj);
    }
  };

  self._onRowCallback = function(row, resultObj) {
    resultObj.addRow(row);

    if (onRowCallback !== undefined) {
      onRowCallback(row, resultObj);
    }
  };

  self._onErrorCallback = function(err, resultObj) {
    if (onErrorCallback !== undefined) {
      onErrorCallback(err, resultObj);
    } else if (onDoneCallback !== undefined) {
      onDoneCallback(err, resultObj);
    }
  };

  self.query = pgClient.query(_.template(queryString)(queryStringOptions));

  self.query.on("row", self._onRowCallback);
  self.query.on("error", self._onErrorCallback);
  self.query.on("end", self._onDoneCallback);
}

module.exports = PGQuery;
