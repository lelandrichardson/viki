var AppEvents = require('../AppEvents');

var Eventable = (function(){
	return {
		componentWillUnmount: function() {
			
		},

		componentDidMount: function(){
			for(var key in this.subscriptions) {
				var sub = this.subscriptions[key] = this.subscriptions[key].bind(this);
				AppEvents.on(key, sub.bind(this));
			}
		}
	};
}());

module.exports = Eventable;