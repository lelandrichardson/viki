/** @jsx React.DOM */
var React = require('react');
var ModalMixin = require('../mixins/ModalMixin');
var Eventable = require('../mixins/Eventable');
var TopNavActions = require('../actions/TopNavActions');
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
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            {this.renderCloseButton()}
                            <strong>Login</strong>
                        </div>
                        <div className="modal-body">
                            <input type="text" className="mb10"
                                valueLink={this.linkState('username')} />
                            <input type="password" className="mb10"
                                valueLink={this.linkState('password')} />
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn" onClick={this.handleSubmit}>
                                Login
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    },

    handleSubmit: function(){
        TopNavActions.addItem({ text: this.state.text });
        this.setState({text: ''});
        this.hide();

    }

});