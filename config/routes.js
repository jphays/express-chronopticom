function init(app)
{
    app.get('/text', function(req, res) {
        res.render('text', { title: 'Nexus' });
    });

    app.get('/test', function(req, res) {
        res.render('test')
    });
}

module.exports.init = init