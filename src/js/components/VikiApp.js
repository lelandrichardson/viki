/** @jsx React.DOM */
var React = require('react');
var TopNav = require('./TopNav');
var MainWindow = require('./MainWindow')
var ModalManager = require('./ModalManager')

var VikiApp = React.createClass({

	render: function() {
		return (
			<div>
				<TopNav />
				<ModalManager />
				<MainWindow />
			</div>
		);
	}

});

module.exports = VikiApp;