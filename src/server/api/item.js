var express = require('express');
var mongoose = require('mongoose');
var Page = mongoose.model('Page');
var Item = mongoose.model('Item');

var items = express.Router();

items.get('/:id', function(req, res) {

	var id = req.param('id');

	Item.findById(id).populate('creator').lean().exec(function(err, item) {
		if (err) {
			res.error(404, "page not found");
		} 
		if (!page) {
			res.error(404, "page not found");
		}
		res.success(item);
	});
});

items.post('/:id', function(req, res) {

    //TODO: permissions

    var id = req.param('id');
    var item = Object.assign({}, req.body, {
        dateModified: Date.now()
    });

    Item.findByIdAndUpdate(id, item, function ( err, saved ) {
        if (err) {
            return res.error(400, err);
        }
        res.success(saved);
    });
});

items.put('/', function(req, res) {

	var item = new Item(req.body);

	item.creator = req.user;

	item.save(function(err) {
		if (err) {
			return res.error(400, err);
		}
		res.success(item);
	});
});

module.exports = items;