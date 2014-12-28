var Flux = require('react-flux');

var Constants = Flux.createConstants([
    "MODAL_HIDE",
    "MODAL_SHOW"
], "APP");

var AppActions = Flux.createActions({

    hideModal: [Constants.MODAL_HIDE, function ( modalId ) {
        return modalId;
    }],

    showModal: [Constants.MODAL_SHOW, function ( modalId, data ) {
        return {
            modalId: modalId,
            data: data
        };
    }]

});

module.exports = AppActions;

module.exports.Constants = Constants;