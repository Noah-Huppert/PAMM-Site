function index(){
  $(document).ready(function(){
    if(App.Models.User === undefined){
      console.log("Route Index");
      App.Router.navigate("loading", {trigger: true, replace: true});
    }
  });
}

module.exports = index;
