/** @jsx React.DOM */
var VikiApp = require('./components/VikiApp');
var React = require('react');

React.renderComponent(
	<VikiApp />,
	document.getElementById('main'));