"use strict";

var express = require("express");
var exphbs = require("express-handlebars");
var cookieParser = require("cookie-parser");
var rekuire = require("rekuire");
var app = express();

var pg = require("pg");
var _ = require("underscore");
var argv = require("optimist").argv;
var GithubApi = require("github-api");

var PGQuery = rekuire("server/PGQuery");

/* General Setup */
var config = rekuire("server/config");

/* Setup Express */
app.engine("hbs", exphbs({
  defaultLayout: "main",
  extname: ".hbs",
  layoutsDir: "src/views/layouts",
  partialsDir: "src/views/partials",
  viewsDir: "src/views",
  helpers: {
    set: rekuire("helpers/set")
  }
}));

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use("/client", express.static(__dirname + "/client"));
app.use("/libs", express.static(__dirname + "/../libs"));
app.use(cookieParser({
  maxAge: 1209600000, //2 weeks
  httpOnly: false,
  domain: argv.dev ? "127.0.0.1:9000" : "https://pamm-site.herokuapp.com/"
}));

/* Database setup */
var pgClient = new pg.Client({
    user: config.secrets.db.user,
    password: config.secrets.db.password,
    database: config.secrets.db.database,
    port: config.secrets.db.port,
    host: config.secrets.db.host,
    ssl: true
});
pgClient.connect();

rekuire("server/PGMigrations")(pgClient);

/* Express Routes */
app.get("/", function(req, res) {
  res.cookie("foo", "bazz");
  res.render("home");
});

app.listen(9000, function() {
  console.log("Listening on port 9000");
});
