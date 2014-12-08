module.exports = {

	index: function(req, res) {
		res.render('index', {
			user: req.user || null,
			request: req
		});
	},

	echo: function(req, res) {
		res.json({
			text: req.param('q')
		});
	}

};