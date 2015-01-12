var React = require('react/addons');

// Utilities
var $http = require('../../util/$http');
var merge = require('deepmerge');

// Mixins
var ModalMixin = require('../../mixins/ModalMixin');
var MergeMixin = require('../../mixins/MergeMixin');

// Stores
var PageStore = require('../../stores/PageStore');
var ItemStore = require('../../stores/ItemStore');

// Actions
var TopNavActions = require('../../actions/TopNavActions');
var AppActions = require('../../actions/AppActions');
var ItemActions = require('../../actions/ItemActions');

// Components
var ImageChooser = require('../shared/ImageChooser');
var PageChooser = require('../shared/PageChooser');
var Select = require('../shared/Select');
var NumberInput = require('../shared/NumberInput');
var { ColorPicker, ColorInput} = require('../shared/ColorInput');
var Slider = require('../shared/Slider');

var ITEM_TYPES = [
    { value: "shape", label: "Shape" },
    { value: "image", label: "Image" }
];

var AddItemModal = React.createClass({

    _emptyState: {
        text: '',
        itemType: 'shape',
        backgroundColor: '#ffffff',
        borderRadius: 0,
        opacity: 0.5,
        sizeWidth: 100,
        sizeHeight: 100,
        positionX: 100,
        positionY: 100,
        linkTo: null,
        image: null
    },

    mixins: [
        ModalMixin,
        MergeMixin,
        React.addons.LinkedStateMixin,
        PageStore.mixin()
    ],

    getDefaultProps: function () {
        return {
            editing: false
        };
    },

    getInitialState: function () {
        return merge(this._emptyState, this.props.item || {});
    },

    itemFromState: function () {
        return {
            pageId: this.state.pageId,
            text: this.state.text,
            image: this.state.image,
            linkTo: this.state.linkTo,
            backgroundColor: this.state.backgroundColor,
            borderRadius: this.state.borderRadius
        };
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
        ItemActions.create(this.itemFromState());
        this.setState(this._emptyState);
        e.preventDefault();
    },

    handleSave: function ( e ) {
        ItemActions.update(this.props.item._id, this.itemFromState());
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

                    <div>Type:</div>
                    <Select className="mb20" valueLink={this.linkState('itemType')} options={ITEM_TYPES} />

                    <div>Background Color:</div>
                    <ColorInput valueLink={this.linkState('backgroundColor')} />

                    <div>Border Radius: {this.state.borderRadius}px</div>
                    <Slider className="mb20" valueLink={this.linkState('borderRadius')} step={1} range={[0,12]} />

                    <div>Text:</div>
                    <input className="mb20" type="text" ref="text" valueLink={this.linkState('text')} />

                    <div>Image:</div>
                    <ImageChooser className="mb20" valueLink={this.linkState('image')} />

                    <div>Links to Page: {JSON.stringify(this.state.linkTo)}</div>
                    <PageChooser valueLink={this.linkState('linkTo')} bindTo="id" />
                </div>
                <div className="modal-footer">{buttons}</div>
            </form>
        );
    }
});

module.exports = AddItemModal;