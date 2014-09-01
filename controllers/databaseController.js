/* Setup namespace */
var pamm = {};
pamm.deps = {};
pamm.config = {};
pamm.controllers = {};

pamm.controllers.database = {};


/* Node require */
pamm.deps.mongodb = require("mongodb");


/* App require */
pamm.config = rekuire("config/app");


pamm.controllers.database.assembleDatabaseUrl = function(){
  var username = pamm.config.secrets.database.username;
  var password = pamm.config.secrets.database.password;
  var dbHost = pamm.config.app.database.host;

  return "mongodb://" + username + ":" + password + "@" + dbHost;
};

pamm.controllers.database.use = function(callback){
  function connectedToDatabase(err, db){
    if(!!err){
      console.log("Error connecting to database: ", err);
    }

    callback(err, db);
  }

  pamm.deps.mongodb(pamm.controllers.database.assembleDatabaseUrl(), connectedToDatabase);
};

pamm.controllers.database.collection = function(collectionName, callback){
  function connectedToDatabase(err, db){
    var collection = db.collection(collectionName);

    if(callback !== undefined){
      callback(err, collection);
    }
  }

  pamm.controllers.database.use(connectedToDatabase);
};

pamm.controllers.database.expireAfter = function(collectionName, expireAfter, callback){
  function connectedToCollection(err, collection){
    collection.ensureIndex({ "createdAt": 1 }, { expireAfterSeconds: expireAfter }, ensureIndexComplete);
  }

  function ensureIndexComplete(err){
    if(!!err){
      console.log("Error setting up expire time: ", err);
    }
    if(callback !== undefined){
      callback(err);
    }
  }

  pamm.controllers.database.collection(collectionName, connectedToCollection);
};

pamm.controllers.database.findAsArray = function(collectionName, findParams, callback){
  function connectedToCollection(err, collection){
    collection.find(findParams).toArray(foundDataAsArray);
  }

  function foundDataAsArray(err, data){
    if(callback !== undefined){
      callback(err, data);
    }
  }

  pamm.controllers.database.collection(collectionName, connectedToCollection);
};

pamm.controllers.database.insert = function(collectionName, insertData, callback){
  function connectedToCollection(err, collection){
    collection.insert(insertData, insertComplete);
  }

  function insertComplete(err, data){
    if(!!err){
      console.log("Error inserting data into database: ", err);
    }

    if(callback !== undefined){
      callback(err, data);
    }
  }

  pamm.controllers.database.collection(collectionName, connectedToCollection);
};

pamm.controllers.database.insertUnique = function(collectionName, insertData, insertUniqueCheck, callback){
  if(typeof insertUniqueCheck === "function"){
    callback = insertUniqueCheck;
    insertUniqueCheck = insertData;
  }

  function gotInsertCheck(err, data){
    if(data.length === 0 || data === undefined){
      pamm.controllers.database.insert(collectionName, insertData, insertComplete);
    } else{
      if(callback !== undefined){
        callback(err, {}, false);
      }
    }
  }

  function insertComplete(err, data){
    callback(err, data, true);
  }

  pamm.controllers.database.findAsArray(collectionName, insertUniqueCheck, gotInsertCheck);
};


module.exports = pamm.controllers.database;
