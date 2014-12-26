var Flux = require('react-flux');
var $http = require('../util/$http');

var Constants = Flux.createConstants([
    "CREATE"
]);

var PageActions = Flux.createActions({

    create: [Constants.CREATE, function(page){
        return $http.put('/api/page', page);
    }]
    
});

module.exports = PageActions;

module.exports.Constants = Constants;