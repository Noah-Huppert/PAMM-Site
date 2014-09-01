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
pamm.deps.handlebars.exhbs = require("express3-handlebars");

global.rekuire = require("rekuire");

/* App requires */
pamm.config = rekuire("config/app");
pamm.controllers.route = rekuire("controllers/routeController");
pamm.controllers.githubApi = rekuire("controllers/githubApiController");
pamm.controllers.handlebars = rekuire("controllers/handlebarsController");


//Setup express
pamm.deps.express.app.set('json spaces', 2);
pamm.deps.express.app.use("/bower", pamm.deps.express.express.static("./bower"));
pamm.deps.express.app.use("/", pamm.deps.express.express.static("./client"));

//Setup sessions
pamm.deps.expressSession.session = pamm.deps.expressSession.expressSession({
  "secret": pamm.config.secrets.session.secret,
  "cookie": {
    "maxAge": 1512000000//2.5 weeks
  },
  resave: true,
  saveUninitialized: true
});
pamm.deps.express.app.use(pamm.deps.expressSession.session);

//Setup handlebars
pamm.deps.handlebars.handlebars = pamm.deps.handlebars.exhbs({
  "extname": "handlebars",
  "partialsDir": "./client/views/partials",
  "layoutsDir": "./client/views/layouts",
  "defaultLayout": "main",
  "helpers": pamm.controllers.handlebars.helpers.exports
});

pamm.deps.express.app.engine("handlebars", pamm.deps.handlebars.handlebars);
pamm.deps.express.app.set("views", "./client/views");
pamm.deps.express.app.set("view engine", "handlebars");

pamm.deps.express.app.listen(pamm.config.app.port, function(){
  console.log("Server now running on port " + pamm.config.app.port);
  pamm.controllers.githubApi.init(pamm.deps.express.app);
  pamm.controllers.route.init(pamm.deps.express.app);
});
