/** @jsx React.DOM */
var React = require('react');
var Icon = require('./Icon').Icon;

var TopNavActions = require('../actions/TopNavActions');
var AuthActions = require('../actions/AuthActions');
var AppActions = require('../actions/AppActions');

var SessionStore = require('../stores/SessionStore');

var TopNav = React.createClass({

	mixins: [
		SessionStore.mixin()
	],

	getStateFromStores: function() {
		return {
			isLoggedIn: SessionStore.isLoggedIn()
		};
	},

	addClick: function(){
		AppActions.showModal("ADD_ITEM");
	},

	logout: function() {
		AuthActions.logout();
	},

	login: function() {
		AppActions.showModal("LOGIN");
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
					<li className="inline">
						<a className="nav-btn">
							{this.state.isLoggedIn ? "LOGGED IN!" : "ANONYMOUS!"}
						</a>
					</li>
					<li className="inline right">
						<a className="nav-btn" onClick={this.addClick}>
							<Icon type="plus" />
						</a>
					</li>
					<li className="inline right">
						<a className="nav-btn" onClick={this.logout}>
							Logout
						</a>
					</li>
					<li className="inline right">
						<a className="nav-btn" onClick={this.login}>
							Login
						</a>
					</li>
				</ul>
			</div>
		);
	}
});

module.exports = TopNav;