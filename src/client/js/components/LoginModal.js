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

    render: function() {
        
        return (
            <div className="modal">
                <div className="modal-backdrop"></div>
                <div className="modal-dialog modal-sm">
                    <form className="modal-content" onSubmit={this.handleSubmit}>
                        <div className="modal-header">
                            {this.renderCloseButton()}
                            <b className="txt-large">Login</b>
                        </div>
                        <div className="modal-body">
                            <input type="text" className="mb15"
                                placeholder="Username"
                                valueLink={this.linkState('username')} />
                            <input type="password"
                                placeholder="Password"
                                valueLink={this.linkState('password')} />
                        </div>
                        <div className="modal-footer">
                            <button type="submit" className="btn small block" onClick={this.handleSubmit}>
                                Login
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        );
    },

    handleSubmit: function(){
        AuthActions.login({
            username: this.state.username,
            password: this.state.password
        });
        return false;
    }

});