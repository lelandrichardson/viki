var React = require('react');
var Icon = require('./../shared/Icon').Icon;

var TopNavActions = require('../../actions/TopNavActions');
var AuthActions = require('../../actions/AuthActions');
var AppActions = require('../../actions/AppActions');

var SessionStore = require('../../stores/SessionStore');

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
                <li className="inline">
                    <a className="nav-btn">
                        <Icon type="cog" onClick={this.cogClick} />
                    </a>
                </li>
            );
        },

        function message () {
            return this.state.isLoggedIn && (
                <li className="inline inverted">
                    Welcome {this.state.user.username}!
                </li>
            );
        },

        function addItemButton () {
            return (
                <li className="inline right">
                    <a className="nav-btn" onClick={this.addClick}>
                        <Icon type="plus" />
                    </a>
                </li>
            );
        },

        function loginButton () {
            return this.state.isLoggedIn ? (
                <li className="inline right">
                    <a className="nav-btn" onClick={this.logout}>
                        Logout
                    </a>
                </li>
            ) : (
                <li className="inline right">
                    <a className="nav-btn" onClick={this.login}>
                        Log In
                    </a>
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