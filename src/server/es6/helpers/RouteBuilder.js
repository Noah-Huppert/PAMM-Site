import _ from "underscore";

function RouteBuilder(route, config){
  var routeParts = route.split(".");

  var routesObj = config.routes;
  var path = "";

  _.each(routeParts, function(routePart){
    routesObj = routesObj[routePart];

    if(routesObj === undefined){
      throw `"${routePart}" is not a valid part`;
    }

    if(routesObj._root !== undefined){
      path += routesObj._root;
    } else {
      path += routesObj;
    }
  });

  return path;
}

export default RouteBuilder;
