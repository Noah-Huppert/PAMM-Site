/* Setup namespace */
var pamm = {};
pamm.deps = {};
pamm.config = {};
pamm.controllers = {};
pamm.models = {};


/* Node require */
pamm.deps.uuid = require("node-uuid");

/* App require */
pamm.config = rekuire("config/app");
pamm.controllers.database = rekuire("controllers/databaseController");

pamm.models.user = function(userId){
  var self = this;

  self.userId = userId !== undefined ? userId : pamm.deps.uuid.v4() + "@pamm-site.com";
  self.userPermissions = [];

  self.dump = function(){
    var dump = {
      "userId": self.userId,
      "userPermissions": self.userPermissions
    };

    return dump;
  };

  self.serialize = function(callback){
    function insertComplete(err, data, unique){
      if(callback !== undefined){
        callback(err, data, unique, self);
      }
    }

    pamm.controllers.database.insertUnique(pamm.config.app.database.usersCollection, self.dump(), { "userId": self.userId }, insertComplete);
  };

  self.deserialize = function(data){
    var allDataPresent = true;

    if(data.userId !== undefined){
      self.userId = data.userId;
    } else{
      allDataPresent = false;
    }

    if(data.userPermissions !== undefined){
      self.userPermissions = data.userPermissions;
    } else{
      allDataPresent = false;
    }

    if(data.githubApiToken !== undefined){
      self.githubApiToken = data.githubApiToken;
    } else{
      allDataPresent = false;
    }

    return allDataPresent;
  };
};

module.exports = pamm.models.user;
