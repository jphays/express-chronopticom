
/**
 * Module dependencies.
 */

var express = require('express'),
	routes = require('./routes'),
	http = require('http'),
	path = require('path'),
	stylus = require('stylus'),
    nib = require('nib');

var app = express();

app.configure(function() {
    app.set('port', process.env.PORT || 3000);
    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'jade');
    app.use(express.favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(stylus.middleware({
        src: path.join(__dirname, 'views'),
        dest: path.join(__dirname, 'public'),
        compile: stylusCompile }));
    app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
    app.use(express.errorHandler());
});

function stylusCompile(str, path) {
    return stylus(str).
        set('filename', path).
        use(nib());
}

//app.get('/', routes.index);
//app.get('/users', user.list);

http.createServer(app).listen(app.get('port'), function(){
    console.log("Express server listening on port " + app.get('port'));
});
