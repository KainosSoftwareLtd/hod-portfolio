var path = require('path'),
    fs = require('fs'),
    session = require('express-session'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    flash = require('connect-flash'),
    express = require('express'),
    browserSync = require('browser-sync'),
    nunjucks = require('express-nunjucks'),
    _ = require('underscore'),
    routes = require(__dirname + '/app/routes.js'),
    authRoutes = require(__dirname + '/app/authRoutes.js'),
    log = require(__dirname + '/app/logger.js'),
    passport = require('passport'),
    favicon = require('serve-favicon'),
    app = express(),
    port = process.env.PORT || 8090,
    env = process.env.NODE_ENV || 'development';

require(__dirname + '/app/passport.js');

function requireHTTPS(req, res, next) {
    // Heroku terminates SSL connections at the load balancer level, so req.secure will never be true
    if (req.headers["x-forwarded-proto"] != "https") {
        return res.redirect('https://' + req.hostname + req.url);
    }
    next();
}

if (env === 'production') {
    app.use(requireHTTPS);
}

// Application settings
app.set('view engine', 'html');
app.set('views', [__dirname + '/app/views/', __dirname + '/lib/']);

// Middleware to serve static assets
app.use('/public', express.static(__dirname + '/public'));
app.use('/public', express.static(__dirname + '/govuk_modules/govuk_template/assets'));
app.use('/public', express.static(__dirname + '/govuk_modules/govuk_frontend_toolkit'));
app.use('/public/images/icons', express.static(__dirname + '/govuk_modules/govuk_frontend_toolkit/images'));

nunjucks.setup({
    autoescape: true,
    watch: true
}, app, function(env) {
    env.addFilter('slugify', function(str) {
        return str.replace(/[.,-\/#!$%\^&\*;:{}=\-_`~()’]/g, "").replace(/ +/g, '_').toLowerCase();
    });
});

// Elements refers to icon folder instead of images folder
app.use(favicon(path.join(__dirname, 'govuk_modules', 'govuk_template', 'assets', 'images', 'favicon.ico')));

// send assetPath to all views
app.use(function(req, res, next) {
    // res.locals.assetPath="/public/";
    res.locals.asset_path = "/public/";
    next();
});

app.use( bodyParser.json() ); // to support JSON-encoded bodies

if (!process.env.COOKIE_SECRET) {
    log.warn('COOKIE_SECRET is not set. Unsafe cookie secret will be used instead.');
}
app.use(cookieParser(process.env.COOKIE_SECRET || "unsafe-secret-CHANGE-ME"));
app.use(session({ cookie: { 
    maxAge: 15 * 60 * 1000 // 15 minutes
}})); 
app.use(flash());

// all routes will have access to this flash message
app.use(function(req, res, next) {
    res.locals.success = req.flash('success');
    next();
});
// Initialize Passport and restore authentication state, if any, from the
// session.
app.use(passport.initialize());
app.use(passport.session());

// routes (found in app/routes.js)
if (typeof(routes) != "function") {
    log.info(routes.bind);
    log.warn("The use of bind in routes is deprecated - please check the prototype kit documentation for writing routes.")
    routes.bind(app);
} else {
    app.use("/", routes);
    app.use("/", authRoutes);
}

// auto render any view that exists
app.get(/^\/([^.]+)$/, function(req, res) {
    var path = (req.params[0]);

    // remove the trailing slash because it seems nunjucks doesn't expect it.
    if (path.substr(-1) === '/') path = path.substr(0, path.length - 1);

    res.render(path, req.data, function(err, html) {
        if (err) {
            res.render(path + "/index", req.data, function(err2, html) {
                if (err2) {
                    res.status(404).send(path + '<br />' + err + '<br />' + err2);
                } else {
                    res.end(html);
                }
            });
        } else {
            res.end(html);
        }
    });
});

// start the app
if (env === 'production') {
    app.listen(port);
} else {
    // for development use browserSync as well
    app.listen(port, function() {
        browserSync({
            proxy: 'localhost:' + port,
            files: ['public/**/*.{js,css}', 'app/views/**/*.html'],
            ghostmode: { clicks: true, forms: true, scroll: true },
            open: false,
            port: (+port + 1), //cast the port to a number to avoid appending 1 to a string
        });
    });
}

log.info('Listening on port ' + port);
