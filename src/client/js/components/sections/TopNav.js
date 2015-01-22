var React = require('react');

// Actions
var TopNavActions = require('../../actions/TopNavActions');
var AuthActions = require('../../actions/AuthActions');
var AppActions = require('../../actions/AppActions');

// Stores
var SessionStore = require('../../stores/SessionStore');

// Components
var Icon = require('./../shared/Icon').Icon;
var Tooltip = require('../shared/Tooltip').Tooltip;
var SearchBar = require('./SearchBar');


var TopNav = React.createClass({

    mixins: [
        SessionStore.mixin()
    ],

    getStateFromStores: function () {
        return {
            isLoggedIn: SessionStore.isLoggedIn(),
            user: SessionStore.user()
        };
    },

    addClick: function () {
        AppActions.showModal("ADD_ITEM");
    },

    cogClick: function () {
        AppActions.showModal("EDIT_PAGE");
    },

    logout: function () {
        AuthActions.logout();
    },

    login: function () {
        AppActions.showModal("LOGIN");
    },

    items: [
        function cogWheel () {
            return (
                <li key="cogwheel" className="inline">
                    <Tooltip tip="Login">
                        <a className="nav-btn" onClick={this.cogClick}>
                            <Icon type="cog" />
                        </a>
                    </Tooltip>
                </li>
            );
        },

        function searchBar () {
            return (
                <li key="searchBar" className="inline">
                    <SearchBar />
                </li>
            );
        },

        function message () {
            return this.state.isLoggedIn && (
                <li key="message" className="inline inverted">
                    Welcome {this.state.user.username}!
                </li>
            );
        },

        function addItemButton () {
            return (
                <li key="addItemBtn" className="inline right">
                    <Tooltip tip="Add Item">
                        <a className="nav-btn" onClick={this.addClick}>
                            <Icon type="plus" />
                        </a>
                    </Tooltip>
                </li>
            );
        },

        function loginButton () {
            return this.state.isLoggedIn ? (
                <li key="logoutBtn" className="inline right">
                    <a className="nav-btn" onClick={this.logout}>
                        Logout
                    </a>
                </li>
            ) : (
                <li key="loginBtn" className="inline right">
                    <Tooltip tip="Login">
                        <a className="nav-btn" onClick={this.login}>
                            Log In
                        </a>
                    </Tooltip>
                </li>
            );
        }
    ],

    render: function () {
        return (
            <div className="top-nav">
                <ul>
                {this.items.map(fn => fn.call(this))}
                </ul>
            </div>
        );
    }
});

module.exports = TopNav;