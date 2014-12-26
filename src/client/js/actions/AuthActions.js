var AuthConstants = require('../constants/AuthConstants.js');
var Flux = require('react-flux');
var Promise = require('es6-promise').Promise;
var $http = require('../util/$http');

var AuthActions = Flux.createActions({

    loginModalOpen: [AuthConstants.LOGIN_MODAL_OPEN, function(){
        return Promise.resolve(true);
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