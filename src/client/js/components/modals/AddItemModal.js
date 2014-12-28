var React = require('react');
require('react/addons');

var ModalMixin = require('../../mixins/ModalMixin');

// Stores
var PageStore = require('../../stores/PageStore');
var ItemStore = require('../../stores/ItemStore');

// Actions
var TopNavActions = require('../../actions/TopNavActions');
var AppActions = require('../../actions/AppActions');
var ItemActions = require('../../actions/ItemActions');

var AddItemModal = React.createClass({

    _emptyState: {
        text: ''
    },

    mixins: [
        ModalMixin,
        React.addons.LinkedStateMixin,
        PageStore.mixin()
    ],

    getDefaultProps: function () {
        return {
            editing: false
        };
    },

    getInitialState: function () {
        return Object.assign({}, this._emptyState, this.props.item || {});
    },

    getStateFromStores: function () {
        return {
            pageId: PageStore.get('current')._id
        };
    },

    onShow: function () {
        this.refs.text.getDOMNode().focus();
    },

    handleAdd: function ( e ) {
        ItemActions.create({
            pageId: this.state.pageId,
            text: this.state.text
        });
        this.setState(this._emptyState);
        e.preventDefault();
    },

    handleSave: function ( e ) {
        ItemActions.update(this.props.item._id, {
            pageId: this.state.pageId,
            text: this.state.text
        });
        e.preventDefault();
    },

    renderModal: function () {

        var title = this.props.editing ? "Edit Item" : "Add Item";

        var submitAction = this.props.editing ? this.handleSave : this.handleAdd;

        var buttons = this.props.editing ? (
            <button type="submit" className="btn" onClick={submitAction}>
                Save
            </button>
        ) : (
            <button type="submit" className="btn" onClick={submitAction}>
                Add
            </button>
        );

        return (
            <form className="modal-content" onSubmit={submitAction}>
                <div className="modal-header">
                    {this.renderCloseButton()}
                    <b className="txt-large">{title}</b>
                </div>
                <div className="modal-body">
                    <div className="mb20">Page Id: {this.state.pageId}</div>

                    <div>Text:</div>
                    <input type="text" ref="text" valueLink={this.linkState('text')} />
                </div>
                <div className="modal-footer">{buttons}</div>
            </form>
        );
    }
});

module.exports = AddItemModal;