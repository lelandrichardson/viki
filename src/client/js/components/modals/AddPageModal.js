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

    mixins: [
        ModalMixin,
        React.addons.LinkedStateMixin,
        PageStore.mixin()
    ],

    getInitialState: function () {
        return Object.assign({}, this._emptyState, this.props.page || {});
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

    handleSubmit: function ( e ) {
        PageActions.create({
            pageId: this.state.pageId,
            text: this.state.text,
            title: this.state.title
        });
        this.setState(this._emptyState);
        e.preventDefault();
    },

    renderModal: function () {
        return (
            <form className="modal-content" onSubmit={this.handleSubmit}>
                <div className="modal-header">
                    {this.renderCloseButton()}
                    <b className="txt-large">Add Page</b>
                </div>
                <div className="modal-body">
                    <div>Title:</div>
                    <input type="text" ref="title" valueLink={this.linkState('title')} />

                    <div>Text:</div>
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

module.exports = AddPageModal;