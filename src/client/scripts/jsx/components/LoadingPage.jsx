var LoadingPage = App.createRoutePage({
  route: "loading",
  render: function(){
    return <div style={{display: this.routeActive}}>Loading</div>;
  }
});

module.exports = LoadingPage;
