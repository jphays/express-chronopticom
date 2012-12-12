function init(app)
{
    app.get('/text', function(req, res) {
        res.render('text', { title: 'Nexus' });
    });
}

module.exports.init = init