"use strict";

function createRouteClass(options){
  if(options.route !== undefined && options.notRoute !== undefined){
    throw "options.route and options.notRoute cannot both be defined at the same time";
  }

  if((options.route === undefined || typeof options.route !== "string") && (options.notRoute === undefined || typeof options.notRoute !== "string")){
    throw "options.route OR options.notRoute must be defined and a string";
  }

  var _options = _.clone(options);

  options.render = function(){
    var element = _options.render.call(this);

    element._store.props = _.extend(element._store.props, {
      style: {
        display: this.state.routeDisplay
      }
    });

    return element;
  };

  options.getInitialState = function(){
    var state = {};

    if(_options.getInitialState !== undefined){
      state = _options.getInitialState();
    }

    state.route = _options.route;
    state.notRoute = _options.notRoute;
    state.routeDisplay = "inherit";
    state.routeParams = {};

    return state;
  };

  options.componentWillMount = function(){
    var self = this;

    App.Router.on("route", function(route, params){
      params = params !== undefined ? params : params;

      var matchesRoute = (self.state.route !== undefined && route === self.state.route);
      var matchesNotRoute = (self.state.notRoute !== undefined && route === self.state.notRoute);

      var needsToShow = (self.state.routeDisplay !== "inherit");
      var needsToHide = (self.state.routeDisplay !== "none");

      if((matchesRoute || !matchesNotRoute) && needsToShow){
        self.setState({
          routeDisplay: "inherit",
          routeParams: params
        });
      } else if((!matchesRoute || matchesNotRoute) && needsToHide){
        self.setState({
          routeDisplay: "none"
        });
      }
    });

    if(_options.componentWillMount !== undefined){
      _options.componentWillMount();
    }
  };

  options.componentWillUnmount = function(){
    App.Router.off("route");

    if(_options.componentWillUnmount !== undefined){
      _options.componentWillUnmount();
    }
  }

  return React.createClass(options);
};

module.exports = createRouteClass;
