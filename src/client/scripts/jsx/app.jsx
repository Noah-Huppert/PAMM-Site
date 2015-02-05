window.React = require("react");

window.mui = require("material-ui");
var injectTagEventPlugin = require("react-tap-event-plugin");

injectTagEventPlugin();


/* Elements */
var Main = require("./components/Main.jsx");

$(document).ready(function(){
    React.render(<Main />, document.body);
});
