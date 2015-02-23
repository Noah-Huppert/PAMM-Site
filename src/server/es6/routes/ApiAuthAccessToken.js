function ApiAuthAccessToken(req, res, config, db){
 var accessToken = req.query.access_token;

 if(accessToken !== undefined){
   db.get(config.oio.collections.accessTokens, accessToken)
   .then(function(data){
     res.json(data);
   })
   .fail(function(err){
     res.json({
       error: config.errors.api.v1.auth.accessToken.accessTokenQueryFail
     });
   });
 } else{
   res.json({
     error: config.errors.api.v1.auth.accessToken.badAccessToken
   });
 }
}

export default ApiAuthAccessToken;
