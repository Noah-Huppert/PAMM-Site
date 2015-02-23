import uuid from "node-uuid";

function ApiAuthCallback(req, res, config, db, github){
  var ghState = req.cookies.ghState;
  res.clearCookie("ghState");

  if(ghState !== undefined && ghState === "&state=" + req.query.state){
    swapGhCodeForGhToken(req, res, config, db, github);
  } else {
    res.redirect(`/?error=${config.errors.api.v1.auth.callback.badGhState}`);
  }
}

function swapGhCodeForGhToken(req, res, config, db, github){
  var ghCode = req.query.code;

  if(ghCode !== undefined){
    github.auth.login(ghCode, function(err, token){
      if(err === null){
        getGhUserInfo(req, res, config, db, github, token);
      } else {
        res.redirect(`/?error=${config.errors.api.v1.auth.callback.ghLoginFail}`);
      }
    });
  }
}

function getGhUserInfo(req, res, config, db, github, token){
  var ghme = github.client(token).me();

  ghme.info(function(err, ghUser){
    if(err === null &&
            ghUser.id !== undefined &&
            ghUser.login !== undefined &&
            ghUser.avatar_url !== undefined){
              saveGhUserInfo(req, res, config, db, github, token, ghUser);
    } else{
      res.redirect(`/?error=${config.errors.api.v1.auth.callback.ghUserInfoFail}`);
    }
  });
}

function saveGhUserInfo(req, res, config, db, github, token, ghUser){
  var ghUserData = {
    login: ghUser.login,
    avatarUrl: ghUser.avatar_url,
    token: token
  };

  db.put(config.oio.collections.users, ghUser.id, ghUserData)
  .then(function(){
    saveSiteAccessToken(req, res, config, db, github, token, ghUser);
  })
  .fail(function(err){
    res.redirect(`/?error=${config.errors.api.v1.auth.callback.ghUserInfoSaveFail}`);
  });
}

function saveSiteAccessToken(req, res, config, db, github, token, ghUser){
  var today = new Date();
  var accessTokenExpiresOn = new Date();
  accessTokenExpiresOn.setDate(today.getDate() + 14);

  var accessToken = uuid.v4();

  var siteAccessTokenData = {
    ghUserId: ghUser.id,
    expiresOn: accessTokenExpiresOn
  };

  res.cookie("accessToken", accessToken);

  db.put(config.oio.collections.accessTokens, accessToken, siteAccessTokenData)
  .then(function(){
    res.redirect("/");//And were done!
  })
  .fail(function(){
    res.redirect(`/?error=${config.errors.api.v1.auth.callback.siteAccessTokenSaveFail}`);
  });
}

export default ApiAuthCallback;
