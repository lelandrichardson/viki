var React = require('react');
var Router = require('react-router');
var SubItem = require('../items/SubItem');
var FullScreenItem = require('../items/FullScreenItem');
var ItemStore = require('../../stores/ItemStore');
var PageActions = require('../../actions/PageActions');
var PageStore = require('../../stores/PageStore');

var Page = React.createClass({

    statics: {
        willTransitionTo: function ( transition, params ) {
            transition.waitFor(PageActions.Constants.GET);
            PageActions.get(params.pageId);
        }
    },

    mixins: [
        ItemStore.mixin(),
        PageStore.mixin()
    ],

    getStateFromStores: function () {
        return {
            page: PageStore.get('current'),
            items: ItemStore.getSubItems()
        };
    },

    render: function () {

        var items = this.state.items.map(function ( item, i ) {
            return (
                <SubItem key={i} item={item} />
            );
        });

        var mainItem = this.state.selected && <FullScreenItem item={this.state.selected} />;

        return (
            <div className="main-window">
				{this.state.page && this.state.page.title}
                <div className="sub-items">
					{items}
                </div>
            </div>
        );
    }

});

module.exports = Page;