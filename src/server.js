"use strict";

var express = require("express");
var exphbs = require("express-handlebars");
var cookieParser = require("cookie-parser");
var rekuire = require("rekuire");
var app = express();

var argv = require("optimist").argv;

var config = rekuire("shared/config")(argv.dev);

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
  domain: config.url
}));

app.get("/", function(req, res) {
  res.cookie("foo", "bazz");
  res.render("home");
});

app.listen(9000, function() {
  console.log("Listening on port 9000");
});
