var mongoose = require('mongoose'),
    ImageSchema = require('./Image'),
	VikiSchema = require('./VikiSchema');

var ItemSchema = new VikiSchema({

    pageId: String,

	text: String,

    image: ImageSchema,

	width: Number,

	height: Number,

	creator: {
		type: String,
		ref: 'User'
    },

    properties: {}
});

mongoose.model('Item', ItemSchema);