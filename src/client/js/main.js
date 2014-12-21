/** @jsx React.DOM */
var VikiApp = require('./components/VikiApp');
var React = require('react');
require('es6-shim');

React.renderComponent(
	<VikiApp />,
	document.getElementById('main'));