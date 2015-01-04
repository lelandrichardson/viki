var React = require('react');
var $http = require('../../util/$http');
var ValueLinkMixin = require('../../mixins/ValueLinkMixin');
var Select = require('./Select');

var cache = {};

var pageToValue = function ( page ) {
    return {
        value: page._id,
        label: page.title,
        page: page
    };
};

var PageChooser = React.createClass({

    mixins: [
        ValueLinkMixin(React.PropTypes.any)
    ],

    propTypes: {
        // this determines what property of the chosen page is spit back to the
        // parent component
        bindTo: React.PropTypes.oneOf([
            "id",
            "page"
        ])
    },

    getDefaultProps: function () {
        return {
            bindTo: "id"
        };
    },

    getInitialState: function () {
        return {
            value: null
        };
    },

    componentWillReceiveProps: function ( newProps ) {
        var link = this.getValueLink(newProps),
            value = link.value,
            result;

        if (!link.value) {
            return;
        }

        switch ( this.props.bindTo ) {
            case "id":
                if (result = cache[value]) {
                    this.setValue(result);
                } else {
                    this.loadPageAsync(value);
                }
                break;

            case "page":
                if (result = cache[value._id]) {
                    this.setValue(result);
                } else {
                    this.setValue(pageToValue(value));
                }
                break;
        }
    },

    setValue: function ( value ) {
        this.setState({
            value: value
        });
    },

    loadPageAsync: function ( id ) {
        $http.get('/api/page/' + id).then(page => {
            var result = cache[page._id] = pageToValue(page);
            this.setValue(result);
        });
    },

    handleChange: function ( value, values ) {
        var link = this.getValueLink();

        if (!value) {
            link.requestChange(value);
            return;
        }

        var page = value.page,
            result;

        cache[page._id] = value;

        switch ( this.props.bindTo ) {
            case "id":
                result = page._id;
                break;

            case "page":
                result = page;
                break;
        }

        link.requestChange(result);
    },

    asyncOptions: function ( input, callback ) {
        $http.get('/api/page/list', { q: input }).then(function ( res ) {
            callback(null, {
                options: res.results.map(pageToValue),
                complete: true
            });
        });
    },

    renderItem: function ( op ) {
        return `${op.page.title} (${op.page._id})`;
    },

    renderValue: function ( op ) {
        return `${op.page.title} (${op.page._id})`;
    },

    render: function () {

        var props = Object.assign({}, this.props);
        delete props.value;
        delete props.onChange;
        delete props.valueLink;

        return (
            <Select
                {...props}
                value={this.state.value}
                onChange={this.handleChange}
                renderItem={this.renderItem}
                renderValue={this.renderValue}
                asyncOptions={this.asyncOptions}
            />
        );
    }
});

module.exports = PageChooser;