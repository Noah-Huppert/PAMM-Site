injectTagEventPlugin();


/* Elements */
var Main = require("./components/main.jsx");

$(document).ready(function(){
    console.log("Ah");
    React.render(<Main />, $("body"));
});

module.exports = {
    Main: Main
};
