var React = require('react');
var TransitionGroup = React.addons.TransitionGroup;

// Stores
var ModalStore = require('../../stores/ModalStore');
var PageStore = require('../../stores/PageStore');

// Modals
var AddItemModal = require('../modals/AddItemModal');
var AddPageModal = require('../modals/AddPageModal');
var LoginModal = require('../modals/LoginModal');
var AlertModal = require('../modals/AlertModal');

var MODALS = {

    "LOGIN": function () {
        return <LoginModal key="LOGIN" modalId="LOGIN" size="small" />
    },

    "ADD_ITEM": function () {
        return <AddItemModal key="ADD_ITEM" modalId="ADD_ITEM" size="medium" />
    },

    "EDIT_ITEM": function ( item ) {
        return <AddItemModal key="EDIT_ITEM" modalId="EDIT_ITEM" size="medium" editing={true} item={item} />
    },

    "ADD_PAGE": function () {
        return <AddPageModal key="ADD_PAGE" modalId="ADD_PAGE" size="medium" />
    },

    "EDIT_PAGE": function () {
        return <AddPageModal key="EDIT_PAGE" modalId="EDIT_PAGE" size="medium" editing={true} page={PageStore.get('current')} />
    },

    "ALERT": function ( data ) {
        return <AlertModal key="ALERT" modalId="ALERT" size="small" message={data.message} />
    }

};

var ModalManager = React.createClass({

    mixins: [
        ModalStore.mixin(),
        PageStore.mixin()
    ],

    getStateFromStores: function () {
        return {
            activeModals: ModalStore.getActiveModals()
        };
    },

    render: function () {

        var modals = this.state.activeModals.map(function ( modal ) {
            var renderFn = MODALS[modal];
            return renderFn && renderFn.call(this, ModalStore.get(modal) || {});
        }, this);

        return (
            <TransitionGroup component="div" className="modals">
				{modals}
            </TransitionGroup>
        );
    }
});

module.exports = ModalManager;