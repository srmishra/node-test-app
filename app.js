var express = require('express'),
	path = require('path'),
	connectAssets = require('connect-assets'),
	favicon = require('serve-favicon'),
	bodyParser = require('body-parser'),
	cookies = require( "cookies" ),
	session = require('express-session'),
	crypto = require('crypto');

//Database
/**
 * Create MySQL Server with config data
 */
var mysql = require('mysql'),
	dbconfig = require('./config/db_config');

global.db = mysql.createConnection(dbconfig.config);

/**
 * Create Express server
 */

var app = express();

var env = process.env.NODE_ENV || 'development';
if ('development' == env) {
    app.locals.pretty = true;
}

/**
 * Express configuration
 */

app.set('port', process.env.PORT || 8080);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(favicon(__dirname + '/public/images/favicon.ico'));
app.use(connectAssets({
    paths: ['public/css', 'public/js', 'bower_components'],
    helperContext: app.locals
}));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cookies.express());
app.use(session({
    secret: 'foobar', // <- this should be a random number or something, but for testing this will be enough
    saveUninitialized: true,
    resave: true
}));

app.use(function(req,res,next) {
    if (req.session !== undefined && req.session.loggedIn !== undefined) {
        res.locals.loggedIn = req.session.loggedIn;
        res.locals.username = req.session.username;
    } else {
        res.locals.loggedIn = false;
    }
    next();
});


/**
 * Error Handling
 */

/**
 * Run server
 */

db.connect(function(err){
    if (err) {
        console.error('MySQL Connection Error: %s', err);
    } else {
        console.log("Successfully connected to MySQL database.");
    }
});

app.listen(app.get('port'), function() {
    console.log("Express server listening on http://localhost:%d", app.get('port'));
});

/**
 * Export the app for testability
 */

module.exports = app;