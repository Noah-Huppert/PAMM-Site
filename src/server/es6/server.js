/* Node import */
import path from "path";

/* Npm import */
import express from "express";
import cookieParser from "cookie-parser";
import oio from "orchestrate";
import github from "octonode";

/* Local import */
import config from "./config/config.js";
config.debug = process.env.PORT === undefined;
config.url = config.debug ? "http://127.0.0.1:9000" : "https://pamm-site.herokuapp.com";

import secrets from "./config/secrets.js";

import RouteBuilder from "./helpers/RouteBuilder.js";

/* Configure requires */
var app = express();
var db = oio(secrets.oio);

/* Express configure */
var clientDirPath = path.resolve("src/client");
app.use(express.static(clientDirPath));
app.use(cookieParser());

/* Routes */
import ApiAuthConnect from "./routes/ApiAuthConnect.js";
import ApiAuthCallback from "./routes/ApiAuthCallback.js";

app.get("/", function(req, res){
  res.sendFile(`${clientDirPath}/views/index.html`);
});

app.get(RouteBuilder("api.v1.auth.connect", config), function(req, res){
  ApiAuthConnect(req, res, config, secrets, github);
});

app.get(RouteBuilder("api.v1.auth.callback", config), function(req, res){
  ApiAuthCallback(req, res, config, db, github);
});

app.listen(process.env.PORT || 9000, function(){
  console.log(`Listening on port ${process.env.PORT || 9000}`);
});
