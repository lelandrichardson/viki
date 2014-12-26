var Flux = require('react-flux');
var AuthConstants = require('../constants/AuthConstants');
var AppConstants = require('../constants/AppConstants');

var SessionStore = Flux.createStore({

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

    [AuthConstants.LOGIN_MODAL_OPEN, function(){
        this.setState({
            LOGIN: true
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
    }]

]);

module.exports = SessionStore;