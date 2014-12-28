var Flux = require('react-flux');
var $http = require('../util/$http');

var Constants = Flux.createConstants([
    "CREATE",
    "UPDATE",
    "GET"
], "PAGE");

var PageActions = Flux.createActions({

    create: [Constants.CREATE, function ( page ) {
        return $http.put('/api/page', page);
    }],

    update: [Constants.UPDATE, function ( pageId, page ) {
        return $http.post('/api/page/' + pageId, page);
    }],

    get: [Constants.GET, function ( pageId ) {
        return $http.get('/api/page/' + pageId);
    }]

});

module.exports = PageActions;

module.exports.Constants = Constants;