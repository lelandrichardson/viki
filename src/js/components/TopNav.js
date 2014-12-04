/** @jsx React.DOM */
var React = require('react');
var Icon = require('react-font-awesome').Icon;
var TopNavActions = require('../actions/TopNavActions.js');
var AppEvents = require('../AppEvents')

var TopNav = React.createClass({

	addClick: function(){
		console.log("addClick!");
		AppEvents.emit("ADD_NEW_ITEM_CLICK");
	},

	render: function() {
		return (
			<div className="top-nav">
				<ul>
					<li className="inline">
						<a className="nav-btn">
							<Icon type="cog" />
						</a>
					</li>
					<li className="inline right">
						<a className="nav-btn" onClick={this.addClick}>
							<Icon type="plus" />
						</a>
					</li>
				</ul>
			</div>
		);
		
	}

});

module.exports = TopNav;