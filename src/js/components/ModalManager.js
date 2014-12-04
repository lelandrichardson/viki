/** @jsx React.DOM */
var React = require('react');
var AddItemModal = require('./AddItemModal')


var ModalManager = React.createClass({

	render: function() {
		return (
			<div className="modals">
				<AddItemModal ref="modal"
			        show={false}
			        handleShow={this.handleShowModal.bind(this)}
			        handleHide={this.handleHideModal.bind(this)} />
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