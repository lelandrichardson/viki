var mongoose = require('mongoose');
var Page = mongoose.model('Page');
var Item = mongoose.model('Item');

var React = require('react');
var VikiApp = React.createFactory(require('../../client/js/components/VikiApp'));
var Router = require('react-router');
var Routes = require('../../client/js/routes');

module.exports = {

    index: function ( req, res ) {


        Router.run(routes, req.path, function ( Handler, state ) {


            Flux.hydrate(res.dehydrate());

            var reactOutput = React.renderToString(VikiApp({}));

            res.render('index', { request: req, reactOutput: reactOutput });

        });


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