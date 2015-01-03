var mongoose = require('mongoose');

var ImageSchema = {
    id: String,
    width: Number,
    height: Number,
    ext: String
};

module.exports = ImageSchema;