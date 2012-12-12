// Express application
var express = require('express');
var app = express();

// Configuration
require('./config/environment').configure(app, express, __dirname);
require('./config/routes').init(app);

// Start the server
app.listen(app.get('port'));
console.log("Express server listening on port " + app.get('port'));
