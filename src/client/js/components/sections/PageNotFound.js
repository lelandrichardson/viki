var React = require('react');

var SessionStore = require('../../stores/SessionStore');
var AppActions = require('../../actions/AppActions');

var PageNotFound = React.createClass({

    mixins: [
        SessionStore.mixin()
    ],

    getStateFromStores: function () {
        return {
            isLoggedIn: SessionStore.isLoggedIn()
        };
    },

    handleCreate: function () {
        console.log("handle create");
        AppActions.showModal("ADD_PAGE");
    },

    handleLogin: function () {
        AppActions.showModal("LOGIN");
    },

    render: function () {
        console.log("render page not found");
        var actions = this.state.isLoggedIn ? (
            <div>
                <button type="button" className="btn large" onClick={this.handleCreate}>Create Page Here</button>
            </div>
        ) : (
            <div>
                <button type="button" className="btn large" onClick={this.handleLogin}>Login to create one</button>
            </div>
        );

        return (
            <div className="center">
                <h3 className="text-large mb20">Page Not Found</h3>
				{actions}
            </div>
        );
    }

});

module.exports = PageNotFound;