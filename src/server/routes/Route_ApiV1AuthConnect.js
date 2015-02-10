var rekuire = require("rekuire");
var uuid = require("node-uuid");

var config = rekuire("../config");
var ServerUrl = rekuire("ServerUrl");
var Route = rekuire("Route");

function routeHandler(req, res){
  var state = uuid.v4();

  res.cookie("state", state);

  res.redirect(config.github.api.connect +
    "?client_id=" + config.secrets.github.clientId +
    "&redirect_uri=" + ServerUrl.fromReq(req) + Route.getRoutePath("api.v1.auth.oauthCallback") +
    "&scope=repo" +
    "&state=" + state);
}

module.exports = routeHandler;
