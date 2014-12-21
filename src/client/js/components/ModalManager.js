/** @jsx React.DOM */
var React = require('react');
var AddItemModal = require('./AddItemModal');
var LoginModal = require('./LoginModal');
var SessionStore = require('../stores/SessionStore');


var ModalManager = React.createClass({

	mixins: [
		SessionStore.mixin()
	],

	getStateFromStores: function() {
        return {
            isLoggedIn: SessionStore.isLoggedIn()
        };
    },

	render: function() {
		return (
			<div className="modals">

				<AddItemModal ref="modal"
			        show={false}
			        handleShow={this.handleShowModal}
			        handleHide={this.handleHideModal} />

		        <LoginModal ref="login"
		        	show={!this.state.isLoggedIn} />
		        	
			</div>
		);
	},

	handleShowModal: function() {
		console.log("inside handleshowmodal from modalmanager");
		//this.refs.modal.show()
	},

	handleHideModal: function() {
		//this.refs.modal.hide()
		console.log("inside handlehidemodal from mdoalmanager")
	}

});

module.exports = ModalManager;