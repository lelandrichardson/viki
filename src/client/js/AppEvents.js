var EventEmitter = require('events').EventEmitter;
require('es6-shim');

var AppEvents = Object.assign(EventEmitter.prototype, {
	// handleViewAction: function(action) {
	// 	console.log(action);
	// 	this.dispatch({
	// 		source: 'VIEW_ACTION',
	// 		action: action
	// 	});
	// }
});

module.exports = AppEvents;