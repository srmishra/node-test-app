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

// This is used for url parsing in the middle of a jade template
app.locals.url = require('url');

/**
 * Multi Language Support
 */

global.lang = require('./controllers/lang')();
app.locals.supportedLanguages = lang.getSupportedLanguages();
app.use(lang.getDictionary);

/**
 * Controllers
 */

var homeController = require('./controllers/home')();
/*var accountController = require('./controllers/account')();
var personsController = require('./controllers/persons')(db);
var singleController = require('./controllers/person')(db);
var companiesController = require('./controllers/companies')(db);
var singleCompanyController = require('./controllers/company')(db);
var importController = require('./controllers/import')(db);
var errorController = require('./controllers/error')();*/

/**
 * Routes
 */

app.get('/', homeController.index);

/*app.get('/login', accountController.loginGet);
app.post('/login', accountController.loginPost);
app.get('/logout', accountController.logoutGet);
app.get('/account/changePassword', accountController.isAuthenticated, accountController.changePasswordGet);
app.post('/account/changePassword', accountController.isAuthenticated, accountController.changePasswordPost);
app.get('/account/create', accountController.isAuthenticated, accountController.createAccountGet);
app.post('/account/create', accountController.isAuthenticated, accountController.createAccountPost);
app.get('/account/delete', accountController.isAuthenticated, accountController.deleteAccountGet);
app.post('/account/delete', accountController.isAuthenticated, accountController.deleteAccountPost);
app.get('/createadmin', accountController.createAdmin); // <= Dev method, should be removed at release

app.get('/persons', accountController.isAuthenticated, personsController.index);
app.get('/persons/new', accountController.isAuthenticated, personsController.newIndex);
app.post('/persons/new', accountController.isAuthenticated, personsController.addPerson);
app.post('/persons/find', accountController.isAuthenticated, personsController.findID);
app.post('/persons/delete', accountController.isAuthenticated, personsController.delete);
app.post('/searchPerson', accountController.isAuthenticated, personsController.searchPerson);
app.post('/sortColumns', accountController.isAuthenticated, personsController.sortColumns);
app.post('/editMemo', accountController.isAuthenticated, personsController.editMemo);

app.get('/persons/:id', accountController.isAuthenticated, singleController.index);
app.get('/persons/:id/edit', accountController.isAuthenticated, singleController.editIndex);
app.post('/persons/:id/edit', accountController.isAuthenticated, singleController.edit);
app.post('/persons/:id/editMemo', accountController.isAuthenticated, singleController.editMemo);

app.get('/companies', accountController.isAuthenticated, companiesController.index);
app.get('/companies/new', accountController.isAuthenticated, companiesController.newIndex);
app.post('/companies/new', accountController.isAuthenticated, companiesController.addCompany);
app.post('/companies/find', accountController.isAuthenticated, companiesController.findID);
app.get('/companies/:id', accountController.isAuthenticated, singleCompanyController.index);

app.get('/lang/:tag', lang.switchLanguage);

app.get('/import', accountController.isAuthenticated, importController.index);
app.post('/import', accountController.isAuthenticated, importController.handleUpload);

app.get('/about', homeController.about);

app.get('/makecoffee', homeController.coffee);*/

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