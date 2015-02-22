/* Node import */
import path from "path";

/* Npm import */
import express from "express";
import orchestrate from "orchestrate";
import github from "octonode";

/* Local import */
import config from "./config/config.js";
config.debug = process.env.PORT === undefined;
config.url = config.debug ? "http://127.0.0.1:9000" : "https://pamm-site.herokuapp.com";

import secrets from "./config/secrets.js";

/* Configure requires */
var app = express();
var db = orchestrate(secrets.orchestrate);

/* Express configure */
var clientDirPath = path.resolve("src/client");
app.use(express.static(clientDirPath));

/* Routes */
import ApiAuthRoute from "./routes/ApiAuth.js";
var ApiAuth = new ApiAuthRoute(github, db, config, secrets);

app.get("/", function(req, res){
  res.sendFile(`${clientDirPath}/views/index.html`);
});

app.get(config.routes.auth.connect, ApiAuth.connect);
app.get(config.routes.auth.callback, ApiAuth.callback);

app.listen(process.env.PORT || 9000, function(){
  console.log(`Listening on port ${process.env.PORT || 9000}`);
});
