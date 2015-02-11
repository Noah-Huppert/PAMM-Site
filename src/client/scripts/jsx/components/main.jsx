var LoadingPage = require("./LoadingPage.jsx");
var MainContainerPage = require("./MainContainerPage.jsx");

var Main = React.createClass({
    render: function(){
        return(
          <div>
            <LoadingPage />
            <MainContainerPage />
          </div>
        );
    }
});

module.exports = Main;
