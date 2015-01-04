var React = require('react');

var MultiSelectValue = React.createClass({

    propTypes: {
        value: React.PropTypes.any.isRequired,
        onRemove: React.PropTypes.func,
        renderValue: React.PropTypes.func
    },

    getDefaultProps: function () {
        return {
            renderValue: function ( val ) {
                return val.label;
            }
        };
    },

    blockEvent: function ( event ) {
        event.stopPropagation();
    },

    render: function () {
        return (
            <div className="Select-item">
                <span className="Select-item-icon" onMouseDown={this.blockEvent} onClick={this.props.onRemove}>&times;</span>
                <span className="Select-item-label">{this.props.renderValue(this.props.value)}</span>
            </div>
        );
    }

});

module.exports = MultiSelectValue;
