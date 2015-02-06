window.React = require("react");
window.Backbone = require("backbone");
window.mui = require("material-ui");
var injectTagEventPlugin = require("react-tap-event-plugin");

//TODO Implement Backbone models
//TODO Implement client-server Bearer Tokens
//TODO Convert React classes to Backbone React classes, use React.createBackboneClass()

injectTagEventPlugin();

/* Elements */
var Main = require("./components/Main.jsx");

$(document).ready(function(){
    React.render(<Main />, document.body);
});
