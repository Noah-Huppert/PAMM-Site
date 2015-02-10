"use strict";

window.React = require("react");

window._ = require("underscore");

window.Backbone = require("backbone");
window.Backbone.$ = window.$;

window.mui = require("material-ui");
window.Request = require("request");

var injectTagEventPlugin = require("react-tap-event-plugin");
var createReactRoutePage = require("./mixins/createReactRoutePage.jsx");

window.App = {
  Router: require("./routes/Router.jsx"),
  createRoutePage: createReactRoutePage
};

/* Elements */
var Main = require("./components/Main.jsx");

$(document).ready(function(){
    React.render(<Main />, document.body);

    App.Router.navigate("loading", {trigger: true, replace: true});
});
