"use strict";

var Router = Backbone.Router.extend({
  routes: {
    "": "index",
    "loading": "loading"
  },
  index: require("./Route_Index.jsx")
});

var AppRouter = new Router();

Backbone.history.start();

module.exports = AppRouter;
