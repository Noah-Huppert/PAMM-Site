/* Setup namespace */
var pamm = {};
pamm.events = {};
pamm.events.event = {};


pamm.events.eventsFired = {
  "domReady": false,
  "polymerReady": false
};

pamm.events.checkComplete = function(){
  var ready = true;

  for(var i = 0; i < pamm.events.eventsFired.length; i++){
    var event = pamm.events.eventsFired[i];

    if(!event){
      ready = false;
    }
  }

  if(ready){
    $(window).trigger("pamm-ready");
  }

  return ready;
};

pamm.events.event.domReady = function(){
  pamm.events.checkComplete();
};

pamm.events.event.polymerReady = function(){
    pamm.events.checkComplete();
};

//Bind events
$(window).on("polymer-ready", pamm.events.event.polymerReady);
$(document).ready(pamm.events.event.domReady);
