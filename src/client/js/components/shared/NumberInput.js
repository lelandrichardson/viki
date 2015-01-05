var React = require('react');
var ValueLinkMixin = require('../../mixins/ValueLinkMixin');

var NumberInput = React.createClass({

    mixins: [
        ValueLinkMixin(React.PropTypes.number)
    ],

    propTypes: {
        type: React.PropTypes.oneOf([
            "int",
            "float"
        ])
    },

    handleChange: function ( e ) {
        var value = this.transform(e.target.value);
        return this.getValueLink().requestChange(value);
    },

    transform: function (val) {
        switch (this.props.type) {
            case "int":
                return parseInt(val, 10);

            case "float":
            default:
                return parseFloat(val);
        }
    },

    render: function () {
        var props = Object.assign({}, this.props);
        delete props.valueLink;

        var value = this.transform(this.getValueLink().value);

        return (
            <input {...props} type="text" value={value} onChange={this.handleChange} />
        )
    }
});

module.exports = NumberInput;