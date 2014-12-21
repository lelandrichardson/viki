var AuthConstants = require('../constants/AuthConstants.js');
var Flux = require('react-flux');
var $http = require('../util/$http');

var AuthActions = Flux.createActions({

    loginModalOpen: [AuthConstants.LOGIN_MODAL_OPEN, function(){
        return null;
    }],

    login: [AuthConstants.LOGIN, function(credentials){
        return $http.post('/api/user/login', credentials);
    }],

    register: [AuthConstants.REGISTER, function(credentials){
        return credentials;
    }],

    logout: [AuthConstants.LOGOUT, function(credentials){
        return credentials;
    }],
    
});

module.exports = AuthActions;