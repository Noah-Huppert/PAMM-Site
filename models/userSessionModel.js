/* Setup namespace */
var pamm = {};
pamm.deps = {};
pamm.config = {};
pamm.controllers = {};
pamm.models = {};


/* Node require */
pamm.deps.uuid = require("node-uuid");
pamm.deps.crypto = require("crypto");


/* App require */
pamm.config = rekuire("config/app");
pamm.controllers.database = rekuire("controllers/databaseController");


pamm.models.userSession = function(){
  var self = this;

  self.userSessionId = pamm.deps.uuid.v4();
  self.userSessionSecret = pamm.deps.crypto.createHash("sha256").update("" + Date.now()).digest("hex");

  var tempDate = new Date();
  self.userSessionExpiresOn = tempDate.setDate(tempDate.getDate() + 14);
  tempDate = undefined;

  self.valid = function(){
    return new Date() <= self.userSessionExpiresOn ? true : false;
  };

  self.dump = function(forDB){
    var dump = {
      "userSessionId": self.userSessionId,
      "userSessionSecret": self.userSessionSecret,
      "userSessionExpiresOn": forDB !== undefined && forDB ? self.userSessionExpiresOn.now() : self.userSessionExpiresOn
    };

    return dump;
  };

  self.serialize = function(callback){
    function insertComplete(err, data, unique){
      if(callback !== undefined){
        callback(err, data, unique, self);
      }
    }

    pamm.controllers.database.insertUnique(pamm.config.app.database.userSessionsCollection, self.dump(), { "userSessionId": self.userSessionId }, insertComplete);
  };

  self.deserlialize = function(data){
    var allDataPresent = true;

    if(data.userSessionId !== undefined){
      self.userSessionId = data.userSessionId;
    } else{
      allDataPresent = false;
    }

    if(data.userSessionSecret !== undefined){
      self.userSessionSecret = data.userSessionSecret;
    } else{
      allDataPresent = false;
    }

    if(data.userSessionExpiresOn !== undefined){
      self.userSessionExpiresOn = data.userSessionExpiresOn;
    } else{
      allDataPresent = false;
    }

    return allDataPresent;
  };
};

module.exports = pamm.models.userSession;
