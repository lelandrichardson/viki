var Flux = require('react-flux');

var TopNavConstants = Flux.createConstants([
	"OPEN_NEW_ITEM_WINDOW",
	"CLOSE_NEW_ITEM_WINDOW",
	"ADD_ITEM_CLICK",
	"SUB_ITEM_CLICK"
]);

module.exports = TopNavConstants;