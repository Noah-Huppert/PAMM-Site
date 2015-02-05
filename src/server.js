"use strict";

var express = require("express");
var exphbs = require("express-handlebars");
var rekuire = require("rekuire");
var app = express();

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

app.get("/", function(req, res){
    res.render("home");
});

app.listen(9000, function(){
    console.log("Listening on port 9000");
});
