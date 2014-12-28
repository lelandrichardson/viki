var React = require('react');
var TopNavActions = require('../../actions/TopNavActions');
var AppActions = require('../../actions/AppActions');

var SubItem = React.createClass({

    propTypes: {
        item: React.PropTypes.object.isRequired
    },

    itemClick: function () {
        AppActions.showModal("EDIT_ITEM", this.props.item);
    },

    render: function () {
        return (
            <div>
                <a className="text-large mb10" onClick={this.itemClick}>{this.props.item.text}</a>
            </div>
        );
    }

});

module.exports = SubItem;