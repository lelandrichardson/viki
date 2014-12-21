var Flux = require('react-flux');

var AuthConstants = Flux.createConstants([
	"LOGIN_MODAL_OPEN",
	"LOGIN",
	"LOGOUT",
	"REGISTER"
]);

module.exports = AuthConstants;