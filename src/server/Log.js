var rekuire = require("rekuire");
var winston = require("winston");

var config = rekuire("config");

winston.add(winston.transports.File, {
  filename: config.log.file,
  timestamp: true,
  prettyPrint: true
});

winston.remove(winston.transports.Console);
winston.add(winston.transports.Console, {
  colorize: true,
  prettyPrint: true,
  stringify: true
});

module.exports= winston;
