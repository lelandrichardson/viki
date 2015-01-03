var express = require('express');
var mongoose = require('mongoose');
var Page = mongoose.model('Page');
var Item = mongoose.model('Item');
var queryToRegex = require('../util/SearchUtil').queryToRegex;

var pages = express.Router();

pages.get('/list', function ( req, res ) {

    var query = {
        start: req.getInt('start') || 0,
        limit: req.getInt('limit') || 10,
        sort: 'title',
        find:  {
            title: queryToRegex(req.param('q'))
        }
    };

    Page.list(query, function ( err, count, results ) {
        if (err) {
            throw err
        }
        res.success({
            count: count,
            results: results
        });
    });
});

// default page route
pages.get('/', function ( req, res ) {

    res.error(404, "no default page defined");

});

pages.get('/:id', function ( req, res ) {

    var id = req.param('id');

    Page.findById(id).populate('creator items').lean().exec(function ( err, page ) {
        if (err) {
            res.error(404, "page not found");
        }
        if (!page) {
            res.error(404, "page not found");
        }
        res.success(page);
    });
});

pages.post('/:id', function ( req, res ) {

    //TODO: check permissions

    var id = req.param('id');

    var page = Object.assign({}, req.body);

    Page.findByIdAndUpdate(id, page, function ( err, saved ) {
        if (err) {
            res.error(400, err);
            return;
        }
        res.success(saved);
    });

});

pages.put('/', function ( req, res ) {

    var page = new Page(req.body);

    page.creator = req.user;

    page.save(function ( err, saved ) {
        if (err) {
            return res.error(400, err);
        }
        res.success(saved);
    });
});

pages.put('/:id/items', function ( req, res ) {

    var pageId = req.param('id');
    var item = new Item(req.body);

    item.pageId = pageId;

    item.creator = req.user;

    item.save(function ( err ) {
        if (err) {
            return res.error(400, err);
        }

        Page.findByIdAndUpdate(
            pageId,
            { $push: { items: item._id } },
            { safe: true, upsert: true },
            function ( err, page ) {
                if (err) {
                    return res.error(400, err);
                }
                res.success(item);
            }
        );
    });
});

module.exports = pages;