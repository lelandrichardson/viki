var Flux = require('react-flux');
var $http = require('../util/$http');

var Constants = Flux.createConstants([
    "CREATE"
]);

var ItemActions = Flux.createActions({

    create: [Constants.CREATE, function(item){
        return $http.put('/api/item', item);
    }]
    
});

module.exports = ItemActions;

module.exports.Constants = Constants;