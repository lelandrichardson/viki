var TopNavConstants = require('../constants/TopNavConstants.js');
var Flux = require('react-flux');

var TopNavActions = Flux.createActions({

    openAddNewItemModal: [TopNavConstants.OPEN_NEW_ITEM_WINDOW,function(){
        return null;
    }],

    setSelectedItem: [TopNavConstants.SUB_ITEM_CLICK,function(item){
        return item;
    }],

    addItem: [TopNavConstants.ADD_ITEM_CLICK,function(item){
        return item;
    }]
    
});

module.exports = TopNavActions;