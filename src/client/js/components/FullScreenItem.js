/** @jsx React.DOM */
var React = require('react');

var FullScreenItem = React.createClass({

	propTypes: {
		item: React.PropTypes.object.isRequired
	},

	render: function() {
		return (
			<div className="full-screen-item">{this.props.item.text}</div>
		);
	}

});

module.exports = FullScreenItem;