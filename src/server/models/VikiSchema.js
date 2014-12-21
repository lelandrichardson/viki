var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	shortId = require('shortid');

module.exports = function(options) {
	return new Schema(Object.assign({
		_id: {
			type: String,
			unique: true,
			default: shortId.generate
		},
		dateModified: {
			type: Date,
			default: Date.now
		},
		dateCreated: {
			type: Date,
			default: Date.now
		}
	}, options));
};