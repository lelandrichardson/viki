var EventEmitter = require('events').EventEmitter;
var merge = require('react/lib/merge');

var AppEvents = merge(EventEmitter.prototype, {
	// handleViewAction: function(action) {
	// 	console.log(action);
	// 	this.dispatch({
	// 		source: 'VIEW_ACTION',
	// 		action: action
	// 	});
	// }
});

module.exports = AppEvents;