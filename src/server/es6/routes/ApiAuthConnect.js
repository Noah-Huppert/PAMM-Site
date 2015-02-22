import RouteBuilder from "../helpers/RouteBuilder.js";

function ApiAuthConnect(req, res, config, secrets, github){
  var ghAuthUrl = github.auth.config({
    id: secrets.github.clientId,
    secret: secrets.github.clientSecret
  }).login(["user", "repo"]);

  var ghState = ghAuthUrl.match(/&state=([0-9a-z]{32})/i)[0];

  res.cookie("ghState", ghState);

  res.redirect(ghAuthUrl);
}

export default ApiAuthConnect;
