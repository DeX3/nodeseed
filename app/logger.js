"use strict";

var winston = require( "winston" );
var config = require( "config" );

var logger = new winston.Logger( {
    transports: config.get( "logging.transports" )
} );

var oldLogFunc = logger.log;
logger.log = function() {
    var args = Array.prototype.slice.call(arguments, 0);
    if (args.length >= 2 && args[1] instanceof Error) {
        args[1] = args[1].stack;
    }
    return oldLogFunc.apply(this, args);
};

module.exports = logger;
