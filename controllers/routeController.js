/* Setup namespace */
var pamm = {};
pamm.controllers = {};

pamm.controllers.route = {};


/* App require */
pamm.controllers.handlebars = rekuire("controllers/handlebarsController");


pamm.controllers.route.init = function(app){
  app.get("/", function(req, res){
    var data = {
      "title": "Home"
    };

    pamm.controllers.handlebars.render(req, res, data, "index");
  });
};

module.exports = pamm.controllers.route;
