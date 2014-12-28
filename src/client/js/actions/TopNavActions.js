var Flux = require('react-flux');

var Constants = Flux.createConstants([
    "SET_SELECTED_ITEM"
]);

var TopNavActions = Flux.createActions({

    setSelectedItem: [Constants.SET_SELECTED_ITEM, function ( item ) {
        return item;
    }]

});

module.exports = TopNavActions;

module.exports.Constants = Constants;