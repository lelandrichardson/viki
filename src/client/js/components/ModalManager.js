var React = require('react');
var TransitionGroup = React.addons.TransitionGroup;
var ModalStore = require('../stores/ModalStore');

var AddItemModal = require('./AddItemModal');
var LoginModal = require('./LoginModal');




var MODALS = {

	"LOGIN": function() {
		return <LoginModal key="LOGIN" modalId="LOGIN" size="small" />
	},

	"ADD_ITEM": function() {
		return <AddItemModal key="ADD_ITEM" modalId="ADD_ITEM" />
	}

};

var ModalManager = React.createClass({

	mixins: [
		ModalStore.mixin()
	],

	getStateFromStores: function() {
        return {
            activeModals: ModalStore.getActiveModals()
        };
    },

	render: function() {

		var modals = this.state.activeModals.map(function(modal){
			var renderFn = MODALS[modal];
			return renderFn && renderFn.call(this);
		}, this);

		return (
			<TransitionGroup component="div" className="modals">
				{modals}
        	</TransitionGroup>
		);
	}
});

module.exports = ModalManager;