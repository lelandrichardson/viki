var AppConstants = require('../constants/AppConstants');
var Flux = require('react-flux');
var Promise = require('es6-promise').Promise;

var AppActions = Flux.createActions({

    hideModal: [AppConstants.MODAL_HIDE, function(modalId){
        return modalId;
    }]
    
});

module.exports = AppActions;