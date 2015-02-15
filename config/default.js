var winston = require( "winston" );

module.exports = {
    "db": {
        "client": "mysql",
        "connection": {
            "host": "localhost",
            "user": "yourapp",
            "charset": "utf8"
        }
    },
    "port": 3000,
    logging: {
        transports: [
            new winston.transports.Console( {
                colorize: true
            } )
        ],
        requests: {
            format: "{{req.method}} {{res.statusCode}} {{req.url}}",
            meta: false
        }
    },
};
