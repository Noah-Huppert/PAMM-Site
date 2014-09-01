/* Setup namespace */
var pamm = {};
pamm.deps = {};
pamm.config = {};
pamm.helpers = {};
pamm.controllers = {};

pamm.controllers.handlebars = {};
pamm.controllers.handlebars.helpers = {};
pamm.controllers.handlebars.helpers.helper = {};


/* Node require */
pamm.deps.markdown = require("github-flavored-markdown");


/* App require */
pamm.config = rekuire("config/app");
pamm.controllers.githubApi = rekuire("controllers/githubApiController");


pamm.controllers.handlebars.helpers.helper.markdown = function(options){
  return pamm.deps.markdwon.parse(options.fn(this));
};

pamm.controllers.handlebars.helpers.helper.include = function(givenRequests, givenFlags, options){
  /*
  Flags:
    - css
    - js
    - polymer
    - ! => bower
  */

  var flags = givenFlags.split(" ");

  if(flags.indexOf("css") !== -1 && this.page.include !== undefined && this.page.include.css !== undefined){
    givenRequests += this.page.include.css;
  }

  if(flags.indexOf("js") !== -1 && this.page.include !== undefined && this.page.include.js !== undefined){
    givenRequests += this.page.include.js;
  }

  if(flags.indexOf("polymer") !== -1 && this.page.include !== undefined && this.page.include.polymer !== undefined){
    givenRequests += this.page.include.polymer;
  }

  var requests = givenRequests.split(" ");

  var rootDir = pamm.config.app.siteUrl;
  var dir = "";

  for(var i = 0; i < flags.length; i++){
    var flag = flags[i];

    switch(flag){
      case "css":
        dir = "styles/css/";
        break;
      case "js":
        dir = "scripts/javascripts/";
        break;
      case "polymer":
        dir = "bower/";
        break;
    }
  }

  var html = "";

  for(var n = 0; n < requests.length; n++){
    var request = requests[n];

    var requestDir = dir;

    if(request.charAt(0) === "!"){
      requestDir = "bower/";
      request = request.substr(1, request.length);
    }

    if(flags.indexOf("polymer") !== -1){
      html += "<link rel=\"import\" href=\"" + rootDir + requestDir + request + "/" + request + ".html\">";
    }

    if(flags.indexOf("css") !== -1){
      html += "<link rel=\"stylesheet\" href=\"" + rootDir + requestDir + request + "\">";
    }

    if(flags.indexOf("js") !== -1){
      html += "<script src=\"" + rootDir + requestDir + request + "\"></script>";
    }
  }

  return html;
};

pamm.controllers.handlebars.helpers.helper.loggedIn = function(user, inverse, options){
  if(user.loggedIn){
    if(inverse !== undefined && inverse){
      return "";
    } else{
      return options.fn(this);
    }
  } else{
    if(inverse !== undefined && inverse){
      return options.fn(this);
    } else{
      return "";
    }
  }
};

pamm.controllers.handlebars.helpers.helper.equals = function(first, second, options){
  if(first === second){
    return options.fn(this);
  } else{
    return "";
  }
};

pamm.controllers.handlebars.helpers.helper.exists = function(existCheck, options){
  if(existCheck !== undefined){
    return options.fn(this);
  } else{
    return options.inverse(this);
  }
};

pamm.controllers.handlebars.helpers.exports = {
  "markdown": pamm.controllers.handlebars.helpers.helper.markdown,
  "include": pamm.controllers.handlebars.helpers.helper.include,
  "loggedIn": pamm.controllers.handlebars.helpers.helper.loggedIn,
  "equals": pamm.controllers.handlebars.helpers.helper.equals,
  "exists": pamm.controllers.handlebars.helpers.helper.exists
};

pamm.controllers.handlebars.render = function(req, res, givenData, pageId, layout){
  var siteData = pamm.config.app;
  var pageData = givenData;

  pamm.controllers.githubApi.auth(req, renderPage);

  function renderPage(loggedIn, userSessionModel, userModel){

    var data = {
      "site": siteData,
      "page": pageData,
      "user": loggedIn ? userModel.dump() : {},
      "userSession": loggedIn ? userSessionModel.dump() : {}
    };

    data.user.loggedIn = loggedIn;

    if(layout !== undefined){
      data.layout = layout;
    }

    res.render(pageId, data);
  }
};

module.exports = pamm.controllers.handlebars;
