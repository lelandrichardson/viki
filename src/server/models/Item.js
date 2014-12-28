var mongoose = require('mongoose'),
	VikiSchema = require('./VikiSchema');

var ItemSchema = new VikiSchema({

    pageId: String,

	text: String,

	image: {
		type: String
	},

	width: Number,

	height: Number,

	creator: {
		type: String,
		ref: 'User'
    },

    properties: {}
});

mongoose.model('Item', ItemSchema);