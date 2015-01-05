var mongoose = require('mongoose'),
    ImageSchema = require('./Image'),
	VikiSchema = require('./VikiSchema');

var ItemSchema = new VikiSchema({

    pageId: String,

    itemType: String,

    position: {
        x: Number,
        y: Number
    },

    size: {
        width: Number,
        height: Number
    },

	text: String,

    image: ImageSchema,

	linkTo: {
        type: String,
        ref: 'Page'
    },

	creator: {
		type: String,
		ref: 'User'
    },

    properties: {}
});

mongoose.model('Item', ItemSchema);