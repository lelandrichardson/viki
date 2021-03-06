var fs = require('fs'),
    http = require('http'),
    https = require('https'),
    express = require('express'),
    morgan = require('morgan'),
    logger = require('./logger'),
    bodyParser = require('body-parser'),
    session = require('express-session'),
    compress = require('compression'),
    methodOverride = require('method-override'),
    cookieParser = require('cookie-parser'),
    helmet = require('helmet'),
    passport = require('passport'),
// mongoStore = require('connect-mongo')({s
// 	session: session
// }),
// flash = require('connect-flash'),
    config = require('./config'),
// consolidate = require('consolidate'),
    path = require('path');

express.response.success = function ( payload ) {
    return this.json({
        success: true,
        code: 200,
        message: null,
        data: payload
    });
};

express.response.error = function ( a, b, c ) {
    var code,
        message,
        payload;

    if (typeof a === 'number') {
        code = a;
        message = b;
        payload = c;
    } else {
        code = 500;
        message = a;
        payload = b;
    }

    if (!payload && message && typeof message !== 'string' && 'message' in message) {
        // assume message is an error object
        payload = message;
        message = message.message;
    }

    return this.json({
        success: false,
        code: code,
        message: message,
        data: payload
    });
};

express.request.getInt = function ( name ) {
    return parseInt(this.param(name) || 0, 10);
};

var HYDRATE_KEY = "__store_hydration";

express.request.hydrate = function ( storeName, data ) {
    if(storeName === undefined) {
        return this[HYDRATE_KEY];
    } else {
        var mergable = {};
        mergable[storeName] = data;
        this[HYDRATE_KEY] = Object.assign(this[HYDRATE_KEY] || {}, mergable);
    }
};

module.exports = function ( db ) {
    // Initialize express app
    var app = express();

    // Globbing model files
    config.getGlobbedFiles('./src/server/models/**/*.js').forEach(function ( modelPath ) {
        require(path.resolve(modelPath));
    });

    // Setting application local variables
    app.locals.title = config.app.title;
    app.locals.description = config.app.description;
    app.locals.keywords = config.app.keywords;
    app.locals.jsFiles = config.getJavaScriptAssets();
    app.locals.cssFiles = config.getCSSAssets();

    // Passing the request url to environment locals
    app.use(function ( req, res, next ) {
        res.locals.url = req.protocol + '://' + req.headers.host + req.url;
        next();
    });



    // Should be placed before express.static
    app.use(compress({
        filter: function ( req, res ) {
            return (/json|text|javascript|css/).test(res.getHeader('Content-Type'));
        },
        level: 9
    }));

    // Showing stack errors
    app.set('showStackError', true);

    // Set ejs as the template engine
    app.engine('html', require('ejs').renderFile);

    // Set views path and view engine
    // app.set('view engine', 'server.view.html');
    app.set('view engine', 'ejs');
    app.set('views', './src/server/views');

    // Enable logger (morgan)
    app.use(morgan(logger.getLogFormat(), logger.getLogOptions()));

    // Environment dependent middleware
    // if (process.env.NODE_ENV === 'development') {
    // 	// Disable views cache
    // 	app.set('view cache', false);
    // } else if (process.env.NODE_ENV === 'production') {
    // 	app.locals.cache = 'memory';
    // }

    // Request body parsing middleware should be above methodOverride
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(bodyParser.json());
    app.use(methodOverride());

    // CookieParser should be above session
    app.use(cookieParser());

    // Express MongoDB session storage
    app.use(session({
        saveUninitialized: true,
        resave: true,
        secret: config.sessionSecret,
        // store: new mongoStore({
        // 	db: db.connection.db,
        // 	collection: config.sessionCollection
        // }),
        cookie: config.sessionCookie,
        name: config.sessionName
    }));

    // use passport session
    app.use(passport.initialize());
    app.use(passport.session());

    // connect flash for flash messages
    // app.use(flash());

    //console.log(path.resolve('./dist'));

    // Use helmet to secure Express headers
    app.use(helmet.xframe());
    app.use(helmet.xssFilter());
    app.use(helmet.nosniff());
    app.use(helmet.ienoopen());
    app.disable('x-powered-by');

    // Setting the app router and static folder
    app.use(express.static(path.resolve('./dist')));

    // hook up our API routes
    app.use('/api', require('../api/router'));

    app.use(function ( req, res, next ) {
        if (req.user) {
            req.hydrate("SessionStore",{
                isLoggedIn: true,
                user: req.user
            });
        }
        next();
    });

    // Globbing routing files
    config.getGlobbedFiles('./src/server/routes/**/*.js').forEach(function ( routePath ) {
        require(path.resolve(routePath))(app);
    });

    // Assume 'not found' in the error msgs is a 404.
    // this is somewhat silly, but valid, you can do whatever you like, set properties,
    // use instanceof etc.
    app.use(function ( err, req, res, next ) {
        // If the error object doesn't exists
        if (!err) {
            return next();
        }

        // Log it
        console.error(err.stack);

        // Error page
        //TODO: make an error pge
        res.status(500).render('500', {
            error: err
        });
    });

    // Assume 404 since no middleware responded
    app.use(function ( req, res ) {
        res.status(404).render('404', {
            url: req.originalUrl,
            error: 'Not Found'
        });
    });

    // if (process.env.NODE_ENV === 'secure') {
    // 	// Load SSL key and certificate
    // 	var privateKey = fs.readFileSync('./config/sslcerts/key.pem', 'utf8');
    // 	var certificate = fs.readFileSync('./config/sslcerts/cert.pem', 'utf8');

    // 	// Create HTTPS Server
    // 	var httpsServer = https.createServer({
    // 		key: privateKey,
    // 		cert: certificate
    // 	}, app);

    // 	// Return HTTPS server instance
    // 	return httpsServer;
    // }

    // Return Express server instance
    return app;
};