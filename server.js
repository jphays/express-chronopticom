var http = require('http')
var port = process.env.PORT || 1337;
http.createServer(function(req, res) {
    //res.writeHead(200, { 'Content-Type': 'text/plain' });
    //res.end('Hello World\n');
    res.writeHead(302, { 'Location': 'http://www.chronopti.com' });
    res.end();
}).listen(port);