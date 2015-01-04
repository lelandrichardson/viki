var React = require('react');

var nop = function(){};

var ValueLinkMixin = function ( propType ) {

    propType = propType || React.PropTypes.any;

    return {
        propTypes: {
            value: propType,
            onChange: React.PropTypes.func,
            valueLink: React.PropTypes.shape({
                value: propType,
                requestChange: React.PropTypes.func
            })
        },

        getValueLink: function ( props ) {
            props = props || this.props;
            return props.valueLink || {
                    value: props.value,
                    requestChange: props.onChange || nop
                };
        }
    };
};

module.exports = ValueLinkMixin;