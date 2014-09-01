//RENAME THIS FILE `secrets.js` AND REPLACE VALUES WITH YOUR OWN
/* Setup namespace */
var pamm = {};
pamm.helpers = {};
pamm.config = {};
pamm.deps = {};


/* App require */
pamm.helpers.merge = rekuire("helpers/mergeHelper");


pamm.config.enviroment = process.argv[2] !== undefined ? process.argv[2] : "development";
pamm.config.secrets = {};


/* Setup common values */
pamm.config.parent = {
  "github": {
    "clientId": "Github API client_id",
    "clientSecret": "Github API client_secret"
  }
};

/* Enviroment specific config */
pamm.config.development = {
  "database": {
    "username": "Mongodb database username",
    "password": "Mongodb database password"
  },
  "session": {
    "secret": "Cookie session secret"
  }
};

pamm.config.production = {
  "database": {
    "username": "Mongodb database username",
    "password": "Mongodb database password"
  },
  "session": {
    "secret": "Cookie session secret"
  }
};


pamm.config.secrets = pamm.config[pamm.config.enviroment] !== undefined ? pamm.helpers.merge.do(pamm.config[pamm.config.enviroment], pamm.config.parent) : pamm.helpers.merge.do(pamm.config.development, pamm.config.parent);

/* Export */
module.exports = pamm.config.secrets;
