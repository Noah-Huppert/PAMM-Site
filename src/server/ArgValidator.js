"use strict";

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

module.exports = {
  checkArg: checkArg,
  checkOptionalArg: checkOptionalArg
};
