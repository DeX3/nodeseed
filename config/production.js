var winston = require( "winston" );

var KILOBYTE = 1024;
var MEGABYTE = 1024 * KILOBYTE;

module.exports = {
    db: {
        connection: {
            database: "yourapp_production",
        }
    },
    logging: {
        transports: [
            new winston.transports.DailyRotateFile( {
                filename: "logs/express.log",
                maxsize: 10 * MEGABYTE,
                json: false
            } ),
        ],
        requests: {
            meta: true
        }
    }
};
