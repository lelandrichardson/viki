var mongoose = require('mongoose');
var Page = mongoose.model('Page');
var Item = mongoose.model('Item');

module.exports = {

    index: function ( req, res ) {
        res.render('index', { request: req });
    },

    pageDetail: function ( req, res ) {

        var id = req.param('id');

        Page.findById(id).populate('creator items').lean().exec(function ( err, page ) {
            if (err) {
                res.error(404, "page not found");
            }
            if (!page) {
                res.error(404, "page not found");
            }

            req.hydrate("PageStore", {
                current: page
            });

            req.hydrate("ItemStore", {
                items: page.items
            });

            res.render('index', { request: req });
        });


    }

};