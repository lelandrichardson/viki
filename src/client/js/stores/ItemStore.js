var Flux = require('react-flux');
var AppConstants = require('../constants/TopNavConstants');

var ItemStore = Flux.createStore({

    getInitialState: function() {
        return {
            items: [],
            selected: null
        };
    },

    getSelectedItem: function(){
        return this.state.get('selected');
    },

    getSubItems: function() {
        return this.state.get('items');
    }

},[

    // top nav add item button has been clicked
    [AppConstants.ADD_ITEM_CLICK, function(payload){
        var item = payload[0];
        var items = this.get('items');
        items.push(item);

        this.setState({
            items: items,
            selected: item
        });
    }],

    // a sub item of the main displayed item has been clicked
    [AppConstants.SUB_ITEM_CLICK, function(payload){
        var item = payload[0];
        this.setState({
            selected: item
        });
    }]

]);

module.exports = ItemStore;