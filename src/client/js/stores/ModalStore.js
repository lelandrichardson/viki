var Flux = require('react-flux');
var AuthConstants = require('../actions/AuthActions').Constants;
var AppConstants = require('../actions/AppActions').Constants;
var ItemConstants = require('../actions/ItemActions').Constants;
var TopNavConstants = require('../actions/TopNavActions').Constants;

var ModalStore = Flux.createStore({

    getInitialState: function() {
        return {
            LOGIN: false,
            REGISTER: false
        };
    },

    getActiveModals: function() {
        var result = [];
        this.state.forEach(function(value,key) {
            if (value) result.push(key);
        });
        return result
    }

},[

    // top nav add item button has been clicked
    [AuthConstants.LOGIN_SUCCESS, function(user){
        this.setState({
            LOGIN: false
        });
    }],

    [AuthConstants.REGISTER_SUCCESS, function(user){
        this.setState({
            REGISTER: false
        });
    }],

    [AuthConstants.LOGOUT_SUCCESS, function(user){
        this.setState({
            LOGIN: false
        });
    }],

    [AppConstants.MODAL_HIDE_SUCCESS, function(modalId){
        var obj = {};
        obj[modalId] = false;
        this.setState(obj);
    }],

    [AppConstants.MODAL_SHOW_SUCCESS, function(modalId){
        var obj = {};
        obj[modalId] = true;
        this.setState(obj);
    }],

    [ItemConstants.CREATE_SUCCESS, function(modalId){
        this.setState({
            ADD_ITEM: false
        });
    }],

]);

module.exports = ModalStore;