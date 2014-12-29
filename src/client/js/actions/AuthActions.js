var Flux = require('react-flux');
var $http = require('../util/$http');

var Constants = Flux.createConstants([
    "LOGIN",
    "LOGOUT",
    "REGISTER"
], "AUTH");

var AuthActions = Flux.createActions({

    login: [Constants.LOGIN, function ( credentials ) {
        return $http.post('/api/user/login', credentials);
    }],

    register: [Constants.REGISTER, function ( credentials ) {
        return $http.post('/api/user/register');
    }],

    logout: [Constants.LOGOUT, function () {
        return $http.post('/api/user/logout');
    }]

});

module.exports = AuthActions;

module.exports.Constants = Constants;