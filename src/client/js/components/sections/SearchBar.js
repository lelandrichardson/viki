var React = require('react/addons');

var ValueLinkMixin = require('../../mixins/ValueLinkMixin');
var classNames = require('../../util/classNames');

var Icon = require('../shared/Icon').Icon;

var SearchResult = React.createClass({

    propTypes: {

    },

    render: function () {
        return (
            <li>
                <a>
                    Item
                </a>
            </li>
        );
    }
});

var SearchBarInput = React.createClass({

    mixins: [
        ValueLinkMixin(React.PropTypes.string)
    ],

    propTypes: {

    },

    render: function () {
        return (
            <input {...this.props} className={classNames("search-bar",this.props.className)} type="text" valueLink={this.getValueLink()} />
        );
    }
});

var SearchBar = React.createClass({

    mixins: [
        React.addons.LinkedStateMixin,
        ValueLinkMixin
    ],

    getInitialState: function () {
        return {
            query: "",
            results: []
        };
    },

    render: function () {

        var results = this.state.results.map(function ( result ) {

        });


        return (
            <div className="inline-block">
                <div className="search-bar-wrapper inline-block">
                    <input className="search-bar" type="text" valueLink={this.linkState('query')} />
                    <a className="search-button">
                        <Icon type="search" />
                    </a>
                </div>
                <ul>

                </ul>
            </div>
        );
    }

});

module.exports = SearchBar;