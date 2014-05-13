var path = require('path'),
    stylus = require('stylus'),
    nib = require('nib');

var favicon = require('serve-favicon'),
    static = require('serve-static'),
    logger = require('morgan');

function configure(app, express, root)
{
    app.set('port', process.env.PORT || 3000);
    app.set('views', path.join(root, 'views'));
    app.set('view engine', 'jade');
    app.use(logger('dev'));
    app.use(favicon(path.join(root, 'public', 'images', 'favicon.ico')));
    app.use(static(path.join(root, 'public')));
    // app.use(express.bodyParser());
    // app.use(express.methodOverride());
    // app.use(app.router);
    // app.use(stylus.middleware({
    //     src: path.join(root, 'views'),
    //     dest: path.join(root, 'public'),
    //     compile: stylusCompile }));

    var env = process.env.NODE_ENV || 'development';
    if (env == 'development') {
        // app.use(express.errorHandler());
    };
};

function stylusCompile(str, path)
{
    return stylus(str).
        set('filename', path).
        use(nib());
}

module.exports.configure = configure;