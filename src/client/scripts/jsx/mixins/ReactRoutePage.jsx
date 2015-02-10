/*var ReactRoutePage = {
  render: function(){
    console.log(this.render());
    return this.render();
  },
  componentWillMount: function(){
    if(this.route === undefined){
      throw "When using BackboneClass the attribute \"route\" must be defined";
    }

    this.routeActive = false;

    App.Router.on("route", function(route, params){
      if(route === this.route){
        this.routeActive = true;
        this.params = params;
        this.render();
      } else {
        this.routeActive = false;
        this.render();
      }
    });
  },
  componentWillUnmount:function(){
    App.Router.off("route");
  }
}*/

function ReactRoutePage(options){
  var self = this;

  if(options.route === undefined){
    throw "ReactRoutePage must have option route";
  }

  if(options.render === undefined){
    throw "ReactRoutePage must have option render";
  }

  self.route = options.route;
  self.routeActive = "none";
  self.routeParams = {};

  self.render = options.render;

  self.componentWillMount = function(){
    console.log("componentWillMount");
    App.Router.on("route", function(route, params){
      console.log("On route", route, params, (route === self.route));
      if(route === self.route){
        self.routeActive = "";
        self.routeParams = params;
        self.render();
      } else if(route !== self.route && self.routeActive === ""){
        self.routeActive = "none";
        self.render();
        //TODO change the call for self.render to a method than notifies state change
      }
    });

    if(options.componentWillMount !== undefined){
      options.componentWillMount();
    }
  };

  self.componentWillUnmount = function(){
    console.log("componentWillUnmount");
    App.Router.off("route");

    if(options.componentWillUnmount !== undefined){
      options.componentWillUnmount();
    }
  };

  return React.createClass(self);
}

module.exports = ReactRoutePage;
