/** @jsx React.DOM */
var React = require('react');
require('react/addons');

var PageStore = require('../../stores/PageStore');

var ModalMixin = require('../../mixins/ModalMixin');

var TopNavActions = require('../../actions/TopNavActions');
var AppActions = require('../../actions/AppActions');
var ItemActions = require('../../actions/ItemActions');

var AddItemModal = React.createClass({

    mixins: [
        ModalMixin,
        React.addons.LinkedStateMixin,
        PageStore.mixin()
    ],

    getInitialState: function() {
        return {
            //pageId: PageStore.get('current').id,
            text: this.props.text || ''
        };
    },

    onShow: function() {
        this.refs.text.getDOMNode().focus();
    },

    handleSubmit: function(e){
        ItemActions.create({
            //pageId:
            text: this.state.text
        });
        this.setState({ text: '' });
        e.preventDefault();
    },

    renderModal: function() {
        return (
            <form className="modal-content" onSubmit={this.handleSubmit}>
                <div className="modal-header">
                    {this.renderCloseButton()}
                    <b className="txt-large">Add Item</b>
                </div>
                <div className="modal-body">
                    <input type="text" ref="text" valueLink={this.linkState('text')} />
                </div>
                <div className="modal-footer">
                    <button type="submit" className="btn" onClick={this.handleSubmit}>
                        Add
                    </button>
                </div>
            </form>
        );
    }
});

module.exports = AddItemModal;