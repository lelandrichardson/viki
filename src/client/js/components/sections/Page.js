var React = require('react');

// Actions
var PageActions = require('../../actions/PageActions');

// Stores
var PageStore = require('../../stores/PageStore');
var ItemStore = require('../../stores/ItemStore');

// Components
var PageItem = require('../items/PageItem');
var PageImage = require('../items/PageImage');

var Page = React.createClass({

    statics: {
        willTransitionTo: function ( transition, params ) {
            // TODO: we could check here if the pagestore currently has the same page id set as current...
            // TODO: in which case, we wouldn't need to wait for anything, or call the GET action.
            var current = PageStore.get('current');

            if (current && current._id === params.pageId) {
                return;
            }

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
                <PageItem key={item._id} item={item} />
            );
        });

        //var mainItem = this.state.selected && <FullScreenItem item={this.state.selected} />;
        // <h1 className="txt-large">{this.state.page.title}</h1>
        return (
            <div className="main-window">
                <PageImage page={this.state.page}>
                    {items}
                </PageImage>
            </div>
        );
    }
});

module.exports = Page;