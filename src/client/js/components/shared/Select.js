var React = require('react');
var ReactSelect = require('react-select');

var Select = React.createClass({

    propTypes: {
        valueLink: React.PropTypes.shape({
            value: React.PropTypes.any,
            requestChange: React.PropTypes.func.isRequired
        })
    },

    render: function () {
        var value,
            onChange;

        if (this.props.valueLink) {
            value = this.props.valueLink.value;
            onChange = this.props.valueLink.requestChange
        } else {
            value = this.props.value;
            onChange = this.props.onChange;
        }

        return (
            <ReactSelect {...this.props} value={value} onChange={onChange} />
        );
    }
});

module.exports = Select;