var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	shortId = require('shortid');

module.exports = function(options) {
	var schema = new Schema(Object.assign({
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

    // whenever saving the model, we replace dateModified with current time
    schema.pre('save', function ( next ) {
        this.dateModified = Date.now();
        next()
    });

    return schema;
};