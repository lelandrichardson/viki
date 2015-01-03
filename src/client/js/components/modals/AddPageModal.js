var React = require('react');
require('react/addons');

// Stores
var PageStore = require('../../stores/PageStore');

// Mixins
var ModalMixin = require('../../mixins/ModalMixin');

// Actions
var PageActions = require('../../actions/PageActions');

// Components
var { VerticalTabs, Tab, TabPane } = require('../shared/VerticalTabs');
var ImageChooser = require('../shared/ImageChooser');
var Select = require('../shared/Select');

var AddPageModal = React.createClass({

    _emptyState: {
        text: '',
        title: '',
        image: null
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
        if (this.refs.title) {
            this.refs.title.getDOMNode().focus();
        }
    },

    handleAdd: function ( e ) {
        PageActions.create({
            text: this.state.text,
            title: this.state.title,
            image: this.state.image
        });
        this.setState(this._emptyState);
        e.preventDefault();
    },

    handleSave: function ( e ) {
        PageActions.update(this.props.page._id, {
            text: this.state.text,
            title: this.state.title,
            image: this.state.image
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
                    <VerticalTabs>
                        <TabPane icon="image">
                            <div>Title:</div>
                            <input type="text" ref="title" className="mb20" valueLink={this.linkState('title')} />

                            <div>Text:</div>
                            <input type="text" ref="text" className="mb20" valueLink={this.linkState('text')} />

                            <div>Image:</div>
                            <ImageChooser valueLink={this.linkState('image')} />

                            <div>Image:</div>
                            <ImageChooser valueLink={this.linkState('image')} />
                        </TabPane>
                        <TabPane icon="cog">
                            <div>
                                This is another tab
                            </div>
                        </TabPane>
                        <TabPane icon="eyedropper">
                            <div>
                                This is another tab
                                <br/>
                                with more spance
                            </div>
                        </TabPane>
                    </VerticalTabs>
                </div>
                <div className="modal-footer">{buttons}</div>
            </form>
        );
    }
});

module.exports = AddPageModal;