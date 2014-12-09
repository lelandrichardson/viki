var Flux = require('react-flux');

var AuthConstants = Flux.createConstants([
	"LOGIN_MODAL_OPEN",
	"LOGIN",
	"REGISTER"
]);

module.exports = AuthConstants;