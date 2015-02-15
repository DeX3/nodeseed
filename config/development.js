var winston = require( "winston" );

module.exports = {
    db: {
        connection: {
            database: "yourapp_development"
        }
    },
    logging: {
        transports: [
            new winston.transports.Console( {
                colorize: true,
                level: "debug"
            } )
        ]
    }
};
