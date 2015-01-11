var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ImageSchema = require('./Image'),
	VikiSchema = require('./VikiSchema');

var ItemSchema = new VikiSchema({

    pageId: String,

    itemType: String,

    position: {
        x: {
            type: Number,
            'default': 50
        },
        y: {
            type: Number,
            'default': 50
        }
    },

    size: {
        width: {
            type: Number,
            'default': 50
        },
        height: {
            type: Number,
            'default': 50
        }
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