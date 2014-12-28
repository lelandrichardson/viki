var Flux = require('react-flux');
var AuthConstants = require('../actions/AuthActions').Constants;
var AppConstants = require('../actions/AppActions').Constants;
var ItemConstants = require('../actions/ItemActions').Constants;
var PageConstants = require('../actions/PageActions').Constants;
var TopNavConstants = require('../actions/TopNavActions').Constants;

function handleAjaxError ( error ) {
    this.setState({
        ALERT: {
            message: error.message
        }
    })
}

var ModalStore = Flux.createStore({

    getInitialState: function () {
        return {
            LOGIN: false,
            REGISTER: false,
            ADD_ITEM: false,
            ADD_PAGE: false,
            EDIT_PAGE: false,
            ALERT: false
        };
    },

    getActiveModals: function () {
        var result = [];
        this.state.forEach(function ( value, key ) {
            // looking for truthy value only
            if (value) {
                result.push(key);
            }
        });
        return result
    }

}, [

    [AuthConstants.LOGIN_FAIL, handleAjaxError],
    [AuthConstants.LOGIN_SUCCESS, function ( user ) {
        this.setState({
            LOGIN: false
        });
    }],

    [AuthConstants.REGISTER_FAIL, handleAjaxError],
    [AuthConstants.REGISTER_SUCCESS, function ( user ) {
        this.setState({
            REGISTER: false
        });
    }],

    [AuthConstants.LOGOUT_SUCCESS, function ( user ) {
        this.setState({
            LOGIN: false
        });
    }],

    [AppConstants.MODAL_HIDE_SUCCESS, function ( modalId ) {
        var obj = {};
        obj[modalId] = false;
        this.setState(obj);
    }],

    [AppConstants.MODAL_SHOW_SUCCESS, function ( payload ) {
        var obj = {};
        obj[payload.modalId] = payload.data || true;
        this.setState(obj);
    }],

    [ItemConstants.CREATE_FAIL, handleAjaxError],
    [ItemConstants.CREATE_SUCCESS, function ( item ) {
        this.setState({
            ADD_ITEM: false
        });
    }],

    [ItemConstants.UPDATE_FAIL, handleAjaxError],
    [ItemConstants.UPDATE_SUCCESS, function ( item ) {
        this.setState({
            EDIT_ITEM: false
        });
    }],

    [PageConstants.CREATE_FAIL, handleAjaxError],
    [PageConstants.CREATE_SUCCESS, function ( page ) {
        this.setState({
            ADD_PAGE: false
        });
    }],

    [PageConstants.UPDATE_FAIL, handleAjaxError],
    [PageConstants.UPDATE_SUCCESS, function ( page ) {
        this.setState({
            EDIT_PAGE: false
        });
    }]

]);

module.exports = ModalStore;