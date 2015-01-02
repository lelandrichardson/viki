var mongoose = require('mongoose'),
    ImageSchema = require('./Image'),
	VikiSchema = require('./VikiSchema');

var PageSchema = new VikiSchema({

    title: String,

    text: String,
	
	slug: {
		type: String,
		unique: true
	},

    image: ImageSchema,

    items: [{
        type: String,
        ref: 'Item'
    }],

	creator: {
		type: String,
		ref: 'User'
    },

    properties: {}
});

mongoose.model('Page', PageSchema);