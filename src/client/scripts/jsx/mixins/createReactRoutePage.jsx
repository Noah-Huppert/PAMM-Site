"use strict";

function createReactRoutePage(options){
  if(options.route === undefined || typeof options.route !== "string"){
    throw "options.route must be defined and a string";
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
    state.routeDisplay = "";
    state.routeParams = {};

    return state;
  };

  options.componentWillMount = function(){
    var self = this;

    App.Router.on("route", function(route, params){
      params = params !== undefined ? params : params;

      if(route === self.state.route && self.state.routeDisplay !== "" && params !== self.state.routeParams){
        self.setState({
          routeDisplay: "",
          routeParams: params
        });
      } else if(route !== self.state.route && self.state.routeDisplay !== "none"){
        self.setState({
          routeDisplay: "none",
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

module.exports = createReactRoutePage;
