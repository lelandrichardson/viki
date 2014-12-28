var Flux = require('react-flux');
var TopNavConstants = require('../actions/TopNavActions').Constants;
var ItemConstants = require('../actions/ItemActions').Constants;

var ItemStore = Flux.createStore({

    getInitialState: function () {
        return {
            items: [],
            selected: null
        };
    },

    getSelectedItem: function () {
        return this.state.get('selected');
    },

    getSubItems: function () {
        return this.state.get('items');
    }

}, [

    // top nav add item button has been clicked
    [ItemConstants.CREATE_SUCCESS, function ( item ) {
        var items = this.get('items');
        items.push(item);

        this.setState({
            items: items,
            selected: item
        });
    }],

    // a sub item of the main displayed item has been clicked
    [TopNavConstants.SET_SELECTED_ITEM_SUCCESS, function ( item ) {
        this.setState({
            selected: item
        });
    }]

]);

module.exports = ItemStore;