var express = require('express');
var mongoose = require('mongoose');
var Page = mongoose.model('Page');
var Item = mongoose.model('Item');

var items = express.Router();

function getItemFull ( req, res, id ) {
    Item.findById(id).populate('creator').lean().exec(function ( err, item ) {
        if (err) {
            res.error(404, "item not found");
        }
        if (!item) {
            res.error(404, "item not found");
        }
        res.success(item);
    });
}

items.get('/:id', function ( req, res ) {

    var id = req.param('id');

    getItemFull(req, res, id);
});

items.post('/:id', function ( req, res ) {

    //TODO: permissions

    var id = req.param('id');
    var item = Object.assign({}, req.body, {
        dateModified: Date.now()
    });

    Item.findByIdAndUpdate(id, item, function ( err, saved ) {
        if (err) {
            return res.error(400, err);
        }
        getItemFull(req, res, id);
    });
});

items.put('/', function ( req, res ) {

    var item = new Item(req.body);

    item.creator = req.user;

    item.save(function ( err, saved ) {
        if (err) {
            return res.error(400, err);
        }
        getItemFull(req, res, saved._id);
    });
});

module.exports = items;