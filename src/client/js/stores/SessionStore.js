var Flux = require('react-flux');
var AuthConstants = require('../constants/AuthConstants');

var SessionStore = Flux.createStore({

    getInitialState: function() {
        return {
            isLoggedIn:false
        };
    },

    isLoggedIn: function() {
        return this.get('isLoggedIn');
    },

    user: function() {
        return this.get('user');
    }

},[

    // top nav add item button has been clicked
    [AuthConstants.LOGIN_SUCCESS, function(user){
        this.setState({
            isLoggedIn: true,
            user: user
        });
    }],

    [AuthConstants.REGISTER_SUCCESS, function(user){
        this.setState({
            isLoggedIn: true,
            user: user
        });
    }],

    [AuthConstants.LOGOUT_SUCCESS, function(){
        this.setState({
            isLoggedIn: false,
            user: null
        });
    }]

]);

module.exports = SessionStore;