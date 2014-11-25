/** @jsx React.DOM */
var React = require('react');
var Icon = require('react-font-awesome').Icon;

var TopNav = React.createClass({

	render: function() {
		return (
			<div className="top-nav">
				<ul>
					<li className="nav-item inline">
						<a className="nav-btn">
							<Icon type="navicon" />
						</a>
					</li>
				</ul>
			</div>
		);
	}

});

module.exports = TopNav;