var winston = require( "winston" );
var path = require( "path" );

var isCoverageEnabled = !!process.env.COVERAGE;
if( isCoverageEnabled ) {
    var istanbul = require( "istanbul-middleware" );
    
    console.log( "Enabling code coverage for " + path.join(__dirname, ".." ) );
    istanbul.hookLoader( path.join(__dirname, "..") );
}

module.exports = {
    db: {
        connection: {
            database: "yourapp_test"
        }
    },
    port: 3001,
    logging: {
        transports: [
            new winston.transports.File( {
                filename: "logs/tests.log",
                colorize: true,
                json: false,
                prettyPrint: true
            } )
        ],
        requests: {
            meta: true
        }
    }
};


if( isCoverageEnabled ) {
    module.exports.additionalMiddleware = {
        "/coverage": istanbul.createHandler()
    };
}
