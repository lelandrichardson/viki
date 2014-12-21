/** @jsx React.DOM */
var React = require('react');
var TopNavActions = require('../actions/TopNavActions');

var SubItem = React.createClass({

	propTypes: {
		item: React.PropTypes.object.isRequired
	},

	itemClick: function(){
		console.log("click!");
		TopNavActions.setSelectedItem(this.props.item);
	},

	render: function() {
	//	var { item, onClick, ...passedProps } = this.props;

		return (
			<div>
				<a onClick={this.itemClick}>{this.props.item.text}</a>
			</div>
		);
	}

});

module.exports = SubItem;