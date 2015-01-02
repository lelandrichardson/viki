var mongoose = require('mongoose');

var ImageSchema = {
    id: String,
    width: Number,
    height: Number,
    type: String
};

module.exports = ImageSchema;