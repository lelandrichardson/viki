var AuthConstants = require('../constants/AuthConstants.js');
var Flux = require('react-flux');

var AuthActions = Flux.createActions({

    loginModalOpen: [AuthConstants.LOGIN_MODAL_OPEN, function(){
        return null;
    }],

    setSelectedItem: [AuthConstants.SUB_ITEM_CLICK, function(item){
        return item;
    }],

    addItem: [AuthConstants.ADD_ITEM_CLICK, function(item){
        return item;
    }]
    
});

module.exports = AuthActions;