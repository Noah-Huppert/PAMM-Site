"use strict";

var Router = Backbone.Router.extend({
  routes: {
    "loading": "loading",
    "foo": "foo"
  }
});

var AppRouter = new Router();

Backbone.history.start();

module.exports = AppRouter;
