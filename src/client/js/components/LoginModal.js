/** @jsx React.DOM */
var React = require('react');
var ModalMixin = require('../mixins/ModalMixin');
var Eventable = require('../mixins/Eventable');
var AuthActions = require('../actions/AuthActions');
var SessionStore = require('../stores/SessionStore');

require('react/addons');

module.exports = React.createClass({

    mixins: [
        ModalMixin, 
        Eventable, 
        React.addons.LinkedStateMixin
    ],

    subscriptions: {
        "USER_LOGIN": function(e){
            this.show();
        }
    },

    getInitialState: function() {
        return {
            username: '',
            password: ''
        };
    },

    onShow: function() {
        this.refs.username.getDOMNode().focus();
    },

    renderModal: function() {
        return (
            <form className="modal-content" onSubmit={this.handleSubmit}>
                <div className="modal-header">
                    {this.renderCloseButton()}
                    <b className="txt-large">Login</b>
                </div>
                <div className="modal-body">
                    <input type="text" className="mb15" ref="username"
                        placeholder="Username"
                        valueLink={this.linkState('username')} />
                    <input type="password" ref="password"
                        placeholder="Password"
                        valueLink={this.linkState('password')} />
                </div>
                <div className="modal-footer">
                    <button type="submit" className="btn small block" onClick={this.handleSubmit}>
                        Login
                    </button>
                </div>
            </form>
        );
    },

    handleSubmit: function(e){
        AuthActions.login({
            username: this.state.username,
            password: this.state.password
        });
        e.preventDefault();
    }

});