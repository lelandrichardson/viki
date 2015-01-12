var React = require('react');

// Utilities
var colorUtil = require('../../util/color');
var classNames = require('../../util/classNames');

// Mixins
var ValueLinkMixin = require('../../mixins/ValueLinkMixin');

// Components
var Picker = require('react-color-picker');
var Slider = require('./Slider');
var Tooltip = require('./Tooltip').Tooltip;

var DEFAULT_COLOR = '#2e2f31';

var Swatch = React.createClass({

    propTypes: {
        color: React.PropTypes.string
    },

    render: function () {

        var style = Object.assign({
            backgroundColor: this.props.color
        }, this.props.style || {});

        return (
            <div {...this.props} className={classNames("cp-swatch", this.props.className)} style={style}></div>
        );
    }
});

var ColorPicker = React.createClass({

    mixins: [
        ValueLinkMixin()
    ],

    propTypes: {
        size: React.PropTypes.number
    },

    getDefaultProps: function () {
        return {
            size: 128
        };
    },

    getInitialState: function () {
        return this.valueToState(this.getValueLink().value);
    },

    handlePickerChange: function (color) {
        this.setState({
            color: color,
            input: null
        }, this.update);
    },

    handleInputChange: function ( e ) {

        var value = e.target.value;
        if (colorUtil.hexToRgb(value)) {
            this.setState({
                color: value,
                input: null
            }, this.update);
        } else {
            this.setState({
                input: value
            });
        }
    },

    handleAlphaChange: function (alpha) {
        this.setState({
            alpha: +(alpha.toFixed(2)),
            input: null
        }, this.update);
    },

    valueToState: function (value) {
        var color, alpha;

        if (!value) {
            color = DEFAULT_COLOR;
            alpha = 1;
        } else if (value[0] === '#') {
            color = value;
            alpha = 1;
        } else {
            var result = colorUtil.rgbaToHexAndAlpha(value);

            color = result.hex;
            alpha = result.alpha;
        }

        return {
            color: color,
            alpha: alpha
        };
    },

    valueFromState: function () {
        var { color, alpha } = this.state;

        if (alpha == 1) {
            return color;
        } else {
            var c = colorUtil.hexToRgb(color);
            return `rgba(${c.r},${c.g},${c.b},${alpha})`;
        }
    },

    update: function () {
        this.getValueLink().requestChange(this.valueFromState());
    },

    render: function () {
        return (
            <div style={{ padding: 4 }}>
                <Picker
                    value={this.state.color}
                    onDrag={this.handlePickerChange}
                    saturationWidth={this.props.size}
                    saturationHeight={this.props.size} />
                <div className="mb8">
                    <Slider size={this.props.size} value={this.state.alpha} onChange={this.handleAlphaChange} />
                    <span className="cp-alpha-indicator">{this.state.alpha}</span>
                </div>
                <input style={{ padding: 3, width: this.props.size}} type="text" value={this.state.input || this.state.color} onChange={this.handleInputChange} />
                <Swatch color={this.valueFromState()} style={{ float: 'right', width: 30, height: 22 }} />
            </div>
        );
    }
});

var ColorInput = React.createClass({

    mixins: [
        ValueLinkMixin()
    ],

    renderEditor: function () {
        return (
            <ColorPicker value={this.getValueLink().value} onChange={this.getValueLink().requestChange} />
        );
    },

    render: function () {
        return (
            <Tooltip render={this.renderEditor} mode="click" color="white">
                <Swatch color={this.getValueLink().value} />
            </Tooltip>
        );
    }
});

module.exports = {
    Swatch: Swatch,
    ColorInput: ColorInput,
    ColorPicker: ColorPicker
};