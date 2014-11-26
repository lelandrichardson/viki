/** @jsx React.DOM */
var React = require('react');
var Icon = require('react-font-awesome').Icon;

var TopNav = React.createClass({

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
						<a className="nav-btn">
							<Icon type="plus" />
						</a>
					</li>
				</ul>
			</div>
		);
	}

});

module.exports = TopNav;