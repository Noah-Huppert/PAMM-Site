import q from "q";

function ApiAuth(github, db, config, secrets){
  var self = this;

  self.ghAuthUrl = github.auth.config({
    id: secrets.github.clientId,
    secret: secrets.github.clientSecret
  }).login(["user", "repo"]);

  self.state = self.ghAuthUrl.match(/&state=([0-9a-z]{32})/i)[0];

  self.connect = function(req, res){
    res.redirect(self.ghAuthUrl);
  };

  self.callbackGotGhMeInfo = function(req, res, token, err, data){
    db.put(config.oio.collections.users, data.id, {
      token: token
    })
    .then(function(){
      res.redirect("/");
    })
    .fail(function(){
      res.redirect(`/?errors=${config.errors.oioSaveUserError}`);
    });
  };

  self.callbackGotGhToken = function(req, res, err, token){
    if(err === undefined || err === null){
      var ghme = github.client(token).me();
      ghme.info(function(err, data){
        self.callbackGotGhMeInfo(req, res, token, err, data);
      });
    } else {
      res.redirect(`/?error=${config.errors.badGhTokenResp}`);
    }
  };

  self.callbackStateCorrect = function(req, res){
    github.auth.login(req.query.code, function(err, token){
      self.callbackGotGhToken(req, res, err, token);
    });
  };

  self.callback = function(req, res){
    if(self.state !== undefined && req.query.state !== self.state){
      self.callbackStateCorrect(req, res);
    } else {
      res.redirect(`/?error=${config.errors.badGhState}`);
    }
  };
}

export default ApiAuth;
