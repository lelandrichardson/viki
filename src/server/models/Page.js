var mongoose = require('mongoose'),
	shortId = require('shortid'),
	VikiSchema = require('./VikiSchema');

var PageSchema = new VikiSchema({

    title: String,

    text: String,
	
	slug: {
		type: String,
		unique: true
	},
	
	image: {
		type: String
	},

    items: [{
        type: String,
        ref: 'Item'
    }],
	
	width: Number,
	
	height: Number,

	creator: {
		type: String,
		ref: 'User'
    },

    properties: {}
});

mongoose.model('Page', PageSchema);