var EventEmitter = require('events').EventEmitter;

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