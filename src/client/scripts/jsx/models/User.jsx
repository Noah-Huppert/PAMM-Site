"use strict";

var User = Backbone.Model.extend({
  authed: false,
  githubId: undefined,

  fetch: function(options){
    if($.cookie("access_token") !== undefined){
      var fetchUrlString = "/api/v1/auth/access_token?access_token=<%= accessToken %>";
      var fetchUrlData = {
        accessToken: $.cookie("access_token")
      };

      var fetchUrlTemplate = _.template(fetchUrlString);

      Request.get(fetchUrlTemplate(fetchUrlData), function(err, fullResponse, body){
        if(err === undefined){
          var bodyData = JSON.parse(body);

          if(fullResponse.statusCode === 200 && bodyData.github_id !== undefined){
            set("authed", true);
            set("githubId", bodyData.github_id);
          } else if(options.error !== undefined){
            options.error(this, bodyData, options);
          }
        } else if(options.error !== undefined){
          options.error(this, err, options);
        }
      });
    }
  }
});

module.exports = User;
