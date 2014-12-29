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

function isCurrentPage ( page ) {

}

var PageStore = Flux.createStore({

    getInitialState: function () {
        return Object.assign({
            current: null,
            parent: null,
            history: []
        }, Hydrate("PageStore"));
    },

    isCurrentPage: function ( page ) {
        var current = this.get('current');
        return current && page._id === current._id;
    },

    pushOntoQueue: function ( next ) {
        var history = this.get('history');
        var current = this.get('current');
        history.push(current);
        this.setState({
            current: next,
            history: history
        });
    }

}, [

    // top nav add item button has been clicked
    [PageConstants.CREATE_SUCCESS, function ( page ) {
        this.pushOntoQueue(page);
    }],

    [PageConstants.UPDATE_SUCCESS, function ( page ) {

        // only update the current page if it's the page that's been updated
        if (!this.isCurrentPage(page)) {
            return;
        }

        this.setState({
            current: page
        });
    }],

    [PageConstants.GET_SUCCESS, function ( page ) {

        // only add current page to history if it's different than the new page
        if (!this.isCurrentPage(page)) {
            this.pushOntoQueue(page);
        } else {
            this.setState({
                current: page
            });
        }
    }],

    // a sub item of the main displayed item has been clicked
    [TopNavConstants.SET_SELECTED_ITEM_SUCCESS, function ( item ) {
        this.setState({
            selected: item
        });
    }]

]);

module.exports = PageStore;