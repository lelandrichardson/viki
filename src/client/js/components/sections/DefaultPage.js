var React = require('react');
var $http = require('../../util/$http');
var Page = require('./Page');

var DefaultPage = React.createClass({

    statics: {
        willTransitionTo: function ( transition, params ) {
            transition.wait($http.get('/api/page').catch(function ( err ) {
                transition.redirect('/getting-started');
            }));
        }
    },

    render: function () {
        return (
            <Page {...this.props}/>
        );
    }

});

module.exports = DefaultPage;