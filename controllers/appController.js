/* Setup namespace */
var pamm = {};
pamm.config = {};
pamm.controllers = {};
pamm.deps = {};


/* Npm requires */
pamm.deps.express = {};
pamm.deps.express.express = require("express");
pamm.deps.express.app = pamm.deps.express.express();

pamm.deps.expressSession = {};
pamm.deps.expressSession.expressSession = require("express-session");

pamm.deps.handlebars = {};
pamm.deps.handlebars.handlebars = require("express3-handlebars");

global.rekuire = require("rekuire");

/* App requires */
pamm.config = rekuire("config/app");
pamm.controllers.githubApi = rekuire("controllers/githubApiController");


//Setup express
pamm.deps.express.app.set('json spaces', 2);
pamm.deps.expressSession.session = pamm.deps.expressSession.expressSession({
  "secret": pamm.config.secrets.session.secret,
  "cookie": {
    "maxAge": 1512000000//2.5 weeks
  }
});
pamm.deps.express.app.use(pamm.deps.expressSession.session);

pamm.deps.express.app.listen(pamm.config.app.port, function(){
  console.log("Server now running on port " + pamm.config.app.port);
  pamm.controllers.githubApi.init(pamm.deps.express.app);
});
