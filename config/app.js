/* Setup namespace */
var pamm = {};
pamm.helpers = {};
pamm.config = {};
pamm.deps = {};

/* App require */
pamm.config.secrets = rekuire("config/secrets");
pamm.helpers.merge = rekuire("helpers/mergeHelper");
pamm.config.enviroment = process.argv[2] !== undefined ? process.argv[2] : "development";

pamm.config.app = {};


/* Setup common values */
pamm.config.parent = {
  "github": {
    "headers": {
      //"Accept": "application/vnd.github.v3+json"
      "Accept": "application/json"
    },
    "api": {
      "urls": {
        "base": { "method": "GET", "url": "https://api.github.com/" },
        "authorize": { "method": "GET", "url": "https://github.com/login/oauth/authorize" },
        "getAccessToken": { "method": "POST", "url": "https://github.com/login/oauth/access_token" }
      }
    },
    "scopes": "user:email,write:repo_hook"
  },
  "api": {
    "urls": {
      "startAuthorization": "/api/auth/connect",
      "redirectUri": "/api/auth/oath2callback"
    }
  },
  "database": {
    "host": "ds053198.mongolab.com:53198/pamm-site",
    "userSessionsCollection": "userSessions",
    "githubApiTokensCollection": "githubApiTokens"
  },
  "port": 3000
};

/* Enviroment specific config */
pamm.config.development = {
  "siteUrl": "http://127.0.0.1:3000/"
};

pamm.config.production = {
  "siteUrl": "http://127.0.0.1:3000/",
  "port": 80
};


/* Assign config to pamm.config.app so it can always be accessed without directly knowing the enviroment */
pamm.config.app = pamm.config[pamm.config.enviroment] !== undefined ? pamm.helpers.merge.do(pamm.config.parent, pamm.config[pamm.config.enviroment]) : pamm.helpers.merge.do(pamm.config.parent, pamm.config.development);


/* Export */
module.exports = pamm.config;
