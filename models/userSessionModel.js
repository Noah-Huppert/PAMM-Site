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


pamm.models.userSession = function(userId){
  var self = this;

  self.userId = userId !== undefined ? userId : pamm.deps.uuid.v4();
  self.userSessionId = pamm.deps.uuid.v4();
  self.userSessionSecret = pamm.deps.crypto.createHash("sha256").update("" + Date.now()).digest("hex");

  var tempDate = new Date();
  self.userSessionExpiresOn = tempDate.setDate(tempDate.getDate() + 14);
  tempDate = undefined;

  self.valid = function(){
    return new Date() <= self.userSessionExpiresOn ? true : false;
  };

  self.dump = function(forDb){
    var dump = {
      "userId": self.userId,
      "userSessionId": self.userSessionId,
      "userSessionSecret": self.userSessionSecret,
      "userSessionExpiresOn": self.userSessionExpiresOn
    };

    if(forDb !== undefined && forDb){
      dump.createdAt = new Data();
    }

    return dump;
  };

  self.serialize = function(callback){
    function expireAfterComplete(err){
      pamm.controllers.database.insertUnique(pamm.config.app.database.userSessionsCollection, self.dump(), { "userSessionId": self.userSessionId }, insertComplete);
    }

    function insertComplete(err, data, unique){
      if(callback !== undefined){
        callback(err, data, unique, self);
      }
    }

    pamm.controllers.database.expireAfter(pamm.config.app.database.userSessionsCollection, 1209600000, expireAfterComplete);
  };

  self.deserialize = function(data){
    var allDataPresent = true;

    if(data.userId !== undefined){
      self.userId = data.userId;
    } else{
      allDataPresent = false;
    }

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
