var React = require('react');

// Actions
var PageActions = require('../../actions/PageActions');

// Stores
var PageStore = require('../../stores/PageStore');
var ItemStore = require('../../stores/ItemStore');

// Components
var SubItem = require('../items/SubItem');
var FullScreenItem = require('../items/FullScreenItem');

var Page = React.createClass({

    statics: {
        willTransitionTo: function ( transition, params ) {
            // TODO: we could check here if the pagestore currently has the same page id set as current...
            // TODO: in which case, we wouldn't need to wait for anything, or call the GET action.

            // when transitioning to a new page, we want to wait for the GET request to complete
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
            items: ItemStore.get('items')
        };
    },

    render: function () {

        var items = this.state.items.map(function ( item, i ) {
            return (
                <SubItem key={i} item={item} />
            );
        });

        //var mainItem = this.state.selected && <FullScreenItem item={this.state.selected} />;

        return (
            <div className="main-window">
                <h1 className="txt-large">{this.state.page.title}</h1>
                <div className="sub-items mt20">
					{items}
                </div>
            </div>
        );
    }
});

module.exports = Page;