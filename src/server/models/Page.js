var mongoose = require('mongoose');
var ImageSchema = require('./Image');
var VikiSchema = require('./VikiSchema');
var MongooseList = require('mongoose-list');

var PageSchema = new VikiSchema({

    title: String,

    text: String,

    slug: {
        type: String,
        unique: true
    },

    image: ImageSchema,

    allowDistortion: Boolean,
    allowScaling: Boolean,
    allowScrollX: Boolean,
    allowScrollY: Boolean,

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

PageSchema.plugin(MongooseList, { searchFields: ['title', 'text'] });

mongoose.model('Page', PageSchema);