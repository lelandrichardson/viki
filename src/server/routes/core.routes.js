module.exports = function(app) {
	var core = require('../controllers/core.controller');
	app.route('/').get(core.index);
    app.route('/p/:id').get(core.pageDetail);
};