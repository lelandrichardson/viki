var React = require('react');
require('react/addons');

var PageStore = require('../../stores/PageStore');

var ModalMixin = require('../../mixins/ModalMixin');

var PageActions = require('../../actions/PageActions');

var AddPageModal = React.createClass({

    _emptyState: {
        text: '',
        title: ''
    },

    propTypes: {
        editing: React.PropTypes.bool,
        page: React.PropTypes.object
    },

    mixins: [
        ModalMixin,
        React.addons.LinkedStateMixin,
        PageStore.mixin()
    ],

    getInitialState: function () {

        return Object.assign({}, this.props.editing ? {} : this._emptyState, this.props.page || {});
    },

    getStateFromStores: function () {
        var current = PageStore.get('current');
        return {
            pageId: current ? current.id : null
        };
    },

    onShow: function () {
        this.refs.title.getDOMNode().focus();
    },

    handleAdd: function ( e ) {
        PageActions.create({
            text: this.state.text,
            title: this.state.title
        });
        this.setState(this._emptyState);
        e.preventDefault();
    },

    handleSave: function ( e ) {
        PageActions.update(this.props.page._id, {
            text: this.state.text,
            title: this.state.title
        });
        e.preventDefault();
    },

    renderModal: function () {

        var title = this.props.editing ? "Edit Page" : "Add Page";

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
                    <div>Title:</div>
                    <input type="text" ref="title" className="mb20" valueLink={this.linkState('title')} />

                    <div>Text:</div>
                    <input type="text" ref="text" valueLink={this.linkState('text')} />
                </div>
                <div className="modal-footer">{buttons}</div>
            </form>
        );
    }
});

module.exports = AddPageModal;