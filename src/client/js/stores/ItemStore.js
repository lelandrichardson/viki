var Flux = require('react-flux');
var ItemConstants = require('../actions/ItemActions').Constants;
var PageConstants = require('../actions/PageActions').Constants;

function findByIdAndReplace ( array, replacement ) {
    var length = array.length,
        item,
        i;

    for (i = 0; i < length; i++) {
        item = array[i];
        if (item._id === replacement._id) {
            array.splice(i, 1, replacement);
            break;
        }
    }

    return array;
}

var ItemStore = Flux.createStore({

    getInitialState: function () {
        return Object.assign({
            items: []
        }, Hydrate("ItemStore"));
    },

    getItems: function () {
        return this.get('items');
    }

}, [

    // top nav add item button has been clicked
    [ItemConstants.CREATE_SUCCESS, function ( item ) {
        var items = this.get('items');
        items.push(item);

        this.setState({
            items: items
        });
    }],

    [ItemConstants.UPDATE_SUCCESS, function ( item ) {
        var items = this.get('items');

        var replaced = findByIdAndReplace(items, item);

        this.setState({
            items: replaced
        });
    }],

    [PageConstants.GET_SUCCESS, function ( page ) {
        this.setState({
            items: page.items
        })
    }]

]);

module.exports = ItemStore;