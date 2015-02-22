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
    console.log(err);
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

/*function ApiAuthCallback(req, res, config, db, github){
  var ghState = req.cookies.ghState;

  if(ghState !== undefined && ghState !== req.query.state){//Good response
    var ghCode = req.query.code;

    if(ghCode !== undefined){//Auth flow is secure
      var ghLoginPromise = Q.defer();

      github.auth.login(ghCode, function(err, token){//Exchange code for Auth Token
        if(err === null){
          ghLoginPromise.resolve(token);
        } else {
          ghLoginPromise.reject(config.errors.api.v1.auth.callback.ghLoginFail);
        }
      });

      ghLoginPromise.promise.then(function(token){//Get user info
        var ghInfoPromise = Q.defer();
        var ghme = github.client(token).me();

        ghme.info(function(err, data){
          if(err === null && data.id !== undefined && data.login !== undefined){
            ghInfoPromise.resolve({
              token: token,
              data: data
            });
          } else {
            ghInfoPromise.reject(config.errors.api.v1.auth.callback.ghUserInfoFail);
          }
        });

        return ghInfoPromise.promise;
      }).then(function(data){//Save user info
        var token = data.token;
        var ghUser = data.data;

        var ghUserData = {
          login: ghUser.login,
          avatarUrl: ghUser.avatar_url,
          token: token
        };

        var dbPutUser = db.put(config.oio.collections.users, ghUser.id, ghUserData);

        return dbPutUser;
      }).then(function(){//Create/Save user session
        var sessionData = {
          //TODO Make this flow a lot neater by not using promises(Q)
        };
      }).fail(function(errCode){
        console.log(errCode);
        res.redirect(`/?error=${errCode}`);
      });
    } else{
      res.redirect(`/?error=${config.errors.api.v1.auth.callback.badGhCode}`);
    }
  } else {
    res.redirect(`/?error=${config.errors.api.v1.auth.callback.badGhState}`);
  }
}*/

export default ApiAuthCallback;
