"use strict";

window.React = require("react");

window._ = require("underscore");

window.Backbone = require("backbone");
window.Backbone.$ = window.$;

window.mui = require("material-ui");
window.Request = require("request");

var injectTagEventPlugin = require("react-tap-event-plugin");
var createRouteClass = require("./mixins/createRouteClass.jsx");

window.App = {
  Router: require("./routes/Router.jsx"),
  createRouteClass: createRouteClass,
  Models: {}
};

//TODO Make own event and router system

/* Elements */
var Main = require("./components/Main.jsx");

App.Router.on("route", function(route){
  console.log(route);
});

$(document).ready(function(){
    React.render(<Main />, document.body);
});
