"use strict";
window.React = require("react");

window.Backbone = require("backbone");
window.Backbone.$ = window.$;

window.mui = require("material-ui");
window.Request = require("request");

var injectTagEventPlugin = require("react-tap-event-plugin");
var ReactRoutePage = require("./mixins/ReactRoutePage.jsx");

window.App = {
  Router: require("./routes/Router.jsx"),
  createRoutePage: function(options){
    return new ReactRoutePage(options);
  }
}

/* Elements */
var Main = require("./components/Main.jsx");

$(document).ready(function(){
    React.render(<Main />, document.body);
    
    App.Router.navigate("loading", {trigger: true, replace: true});
});
