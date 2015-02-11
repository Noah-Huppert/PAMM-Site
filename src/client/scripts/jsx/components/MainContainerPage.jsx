var Navbar = require("./Navbar.jsx");

var MainContainerPage = App.createRouteClass({
  notRoute: "loading",
  render: function(){
    return (
      <div>
        <Navbar />
      </div>
    );
  }
});

module.exports = MainContainerPage;
