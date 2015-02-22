/* Node import */
import path from "path";

/* Npm import */
import express from "express";
import oio from "orchestrate";

import passport from "passport";
import GithubStrategy from "passport-github";

/* Local import */
import secrets from "./secrets.js";

/* Configure requires */
var app = express();
var db = oio(secrets.oio);

var clientDirPath = path.resolve("src/client");

/* Routes */
app.get("/", function(req, res){
  res.sendFile(`${clientDirPath}/views/index.html`);
});

app.listen(process.env.PORT || 9000, function(){
  console.log(`Listening on port ${process.env.PORT || 9000}`);
});
