var Flux = require('react-flux');
var TopNavConstants = require('../actions/TopNavActions').Constants;
var ItemConstants = require('../actions/ItemActions').Constants;
var PageConstants = require('../actions/PageActions').Constants;

function pushOntoQueue ( store, next ) {
    var history = store.get('history');
    var current = store.get('current');
    history.push(current);
    store.setState({
        current: next,
        history: history
    });
}

var PageStore = Flux.createStore({

    getInitialState: function () {
        return {
            current: null,
            parent: null,
            history: []
        };
    }

}, [

    // top nav add item button has been clicked
    [PageConstants.CREATE_SUCCESS, function ( page ) {
        pushOntoQueue(this, item);
    }],

    [PageConstants.GET_SUCCESS, function ( page ) {
        pushOntoQueue(this, page);
    }],

    // a sub item of the main displayed item has been clicked
    [TopNavConstants.SET_SELECTED_ITEM_SUCCESS, function ( item ) {
        this.setState({
            selected: item
        });
    }]

]);

module.exports = PageStore;