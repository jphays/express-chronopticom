var path = require('path'),
    stylus = require('stylus'),
    nib = require('nib');

function configure(app, express, root)
{
    app.configure(function()
    {
        app.set('port', process.env.PORT || 3000);
        app.set('views', path.join(root, 'views'));
        app.set('view engine', 'jade');
        app.use(express.static(path.join(root, 'public')));
        app.use(express.favicon(path.join(root, 'public', 'images', 'favicon.ico')));
        app.use(express.logger('dev'));
        app.use(express.bodyParser());
        app.use(express.methodOverride());
        app.use(app.router);
        app.use(stylus.middleware({
            src: path.join(root, 'views'),
            dest: path.join(root, 'public'),
            compile: stylusCompile }));
    });

    app.configure('development', function(){
        app.use(express.errorHandler());
    });
};

function stylusCompile(str, path)
{
    return stylus(str).
        set('filename', path).
        use(nib());
}

module.exports.configure = configure;