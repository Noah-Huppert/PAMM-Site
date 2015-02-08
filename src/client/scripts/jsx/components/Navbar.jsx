var Toolbar = mui.Toolbar;
var ToolbarGroup = mui.ToolbarGroup;

var RaisedButton = mui.RaisedButton;

var Navbar = React.createClass({
    getInitialState: function(){
      var user = {
        username: "Loading...",
        favicon: "https://octodex.github.com/images/daftpunktocat-thomas.gif"
      };
      return {"user": user};
    },
    //TODO Load User information from server
    //TODO Implement client server user authetication
    render: function(){
      return(
        <Toolbar>
          <ToolbarGroup key={0} float="right">
            <RaisedButton label="Login or Register" primary={true} onMouseUp={this._loginButtonClick} />
          </ToolbarGroup>
          <ToolbarGroup key={1} float="right">
            <span id="Navbar_LoggedIn_Username">{this.state.user.username}</span>
            <img src={this.state.user.favicon} id="Navbar_LoggedIn_Favicon" />
          </ToolbarGroup>
        </Toolbar>
      );
    },
    _loginButtonClick: function(){
      //TODO Implement Navbar._loginButtonClick
      console.log("Navbar.Login");
    }
});

module.exports = Navbar;
