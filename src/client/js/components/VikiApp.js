/** @jsx React.DOM */
var React = require('react');
var TopNav = require('./sections/TopNav');
var MainWindow = require('./MainWindow');
var ModalManager = require('./sections/ModalManager');
var RouteHandler = require('react-router').RouteHandler;

var VikiApp = React.createClass({

	render: function() {
		return (
			<div>
				<TopNav />
				<ModalManager />
				<RouteHandler />
				<MainWindow />
			</div>
		);
	}

});

module.exports = VikiApp;