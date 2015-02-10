var LoadingPage = require("./LoadingPage.jsx");
var Navbar = require("./Navbar.jsx");

var Main = React.createClass({
    render: function(){
        return(
          <div>
            <LoadingPage />
            <Navbar />
          </div>
        );
    }
});

module.exports = Main;
