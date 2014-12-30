module.exports = function(app) {
	var controller = require('../controllers/image.controller');
	app.route('/upload').post(controller.upload);
};