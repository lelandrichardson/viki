var React = require('react');
var TransitionGroup = React.addons.TransitionGroup;
var ModalStore = require('../../stores/ModalStore');
var PageStore = require('../../stores/PageStore');

var AddItemModal = require('../modals/AddItemModal');
var AddPageModal = require('../modals/AddPageModal');
var LoginModal = require('../modals/LoginModal');

var MODALS = {

    "LOGIN": function () {
        return <LoginModal key="LOGIN" modalId="LOGIN" size="small" />
    },

    "ADD_ITEM": function () {
        return <AddItemModal key="ADD_ITEM" modalId="ADD_ITEM" size="medium" />
    },

    "ADD_PAGE": function () {
        return <AddPageModal key="ADD_PAGE" modalId="ADD_PAGE" size="medium" />
    },

    "EDIT_PAGE": function () {
        return <AddPageModal key="EDIT_PAGE" modalId="EDIT_PAGE" size="medium" page={PageStore.get('current')} />
    }

};

var ModalManager = React.createClass({

    mixins: [
        ModalStore.mixin()
    ],

    getStateFromStores: function () {
        return {
            activeModals: ModalStore.getActiveModals()
        };
    },

    render: function () {

        var modals = this.state.activeModals.map(function ( modal ) {
            var renderFn = MODALS[modal];
            return renderFn && renderFn.call(this);
        }, this);

        return (
            <TransitionGroup component="div" className="modals">
				{modals}
            </TransitionGroup>
        );
    }
});

module.exports = ModalManager;