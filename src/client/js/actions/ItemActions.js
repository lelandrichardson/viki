var Flux = require('react-flux');
var $http = require('../util/$http');

var Constants = Flux.createConstants([
    "CREATE",
    "UPDATE"
], "ITEM");

var ItemActions = Flux.createActions({

    create: [Constants.CREATE, function ( item ) {
        return $http.put('/api/page/' + item.pageId + '/items', item);
    }],

    update: [Constants.UPDATE, function ( itemId, item ) {
        return $http.post('/api/item/' + itemId, item);
    }]

});

module.exports = ItemActions;

module.exports.Constants = Constants;