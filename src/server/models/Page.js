var mongoose = require('mongoose'),
	shortId = require('shortid'),
	VikiSchema = require('./VikiSchema');

require('./Item');

var ItemSchema = mongoose.model('Item').schema;

var PageSchema = new VikiSchema({

    title: String,
	
	slug: {
		type: String,
		unique: true
	},
	
	image: {
		type: String
	},
	
	items: [ItemSchema],
	
	width: Number,
	
	height: Number,

	creator: {
		type: String,
		ref: 'User'
	}
});

mongoose.model('Page', PageSchema);