var mongoose = require('mongoose'),
	VikiSchema = require('./VikiSchema');

var ItemSchema = new VikiSchema({

	text: String,

	image: {
		type: String
	},

	width: Number,

	height: Number,

	creator: {
		type: String,
		ref: 'User'
	}
});

mongoose.model('Item', ItemSchema);