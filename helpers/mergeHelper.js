//Code from: https://github.com/rxaviers/cldr
/* Setup namespace */
var pamm = {};
pamm.helpers = {};

pamm.helpers.merge = {};

pamm.helpers.merge.do = function(){
  var destination = {},
      sources = [].slice.call( arguments, 0 );
  sources.forEach(function( source ) {
      var prop;
      for ( prop in source ) {
          if ( prop in destination && Array.isArray( destination[ prop ] ) ) {

              // Concat Arrays
              destination[ prop ] = destination[ prop ].concat( source[ prop ] );

          } else if ( prop in destination && typeof destination[ prop ] === "object" ) {

              // Merge Objects
              destination[ prop ] = pamm.helpers.merge.do( destination[ prop ], source[ prop ] );

          } else {

              // Set new values
              destination[ prop ] = source[ prop ];

          }
      }
  });
  return destination;
};
module.exports = pamm.helpers.merge;
