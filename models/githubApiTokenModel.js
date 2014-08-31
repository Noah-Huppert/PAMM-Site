/* Setup namespace */
var pamm = {};
pamm.deps = {};
pamm.config = {};
pamm.controllers = {};
pamm.models = {};


/* App require */
pamm.config = rekuire("config/app");
pamm.controllers.database = rekuire("controllers/databaseController");

pamm.models.githubApiToken = function(accessToken, tokenType, scope){
  var self = this;

  self.accessToken = accessToken !== undefined ? accessToken : "Not specified";
  self.tokenType = tokenType !== undefined ? tokenType : "Not specified";
  self.scope = scope !== undefined ? scope : "Not specified";

  self.dump = function(){
    var dump = {
      "accessToken": self.accessToken,
      "tokenType": self.tokenType,
      "scope": self.scope
    };

    return dump;
  };

  self.serialize = function(callback){
    function insertComplete(err, data, unique){
      if(callback !== undefined){
        callback(err, data, unique, self);
      }
    }

    pamm.controllers.database.insertUnique(pamm.config.app.database.githubApiTokensCollection, self.dump(), { "accessToken": self.accessToken }, insertComplete);
  };

  self.deserlialize = function(data){
    var allDataPresent = true;

    if(data.accessToken !== undefined){
      self.accessToken = data.accessToken;
    } else{
      allDataPresent = false;
    }

    if(data.tokenType !== undefined){
      self.tokenType = data.tokenType;
    } else{
      allDataPresent = false;
    }

    if(data.scope !== undefined){
      self.scope = data.scope;
    } else{
      allDataPresent = false;
    }

    return allDataPresent;
  };
};


module.exports = pamm.models.githubApiToken;
