var React = require('react');
var ValueLinkMixin = require('../../mixins/ValueLinkMixin');
var classNames = require('../../util/classNames');
var dom = require('../../util/dom');

/**
 * This is a basic slider component, built primarily for use as a single numeric input
 */
var Slider = React.createClass({

    mixins: [
        ValueLinkMixin(React.PropTypes.number)
    ],

    propTypes: {
        /**
         * An array representing the allowed range of values.
         */
        range: React.PropTypes.array,

        /**
         * The color of the slider's bar, when not "filled in"
         */
        barColor: React.PropTypes.string,

        /**
         * The color of the slider's bar when "filled in"
         */
        barFillColor: React.PropTypes.string,

        /**
         * An optional class name to put on the slider's handle
         */
        handleClass: React.PropTypes.string,

        /**
         * The width (in pixels) of the slider. If not provided, the bar will fill the width of it's container
         */
        size: React.PropTypes.number,

        /**
         * The amount to round/increment the values by
         */
        step: React.PropTypes.number
    },

    getDefaultProps: function () {
        return {
            range: [0, 1],
            step: 0.1
        };
    },

    /**
     * Since we don't want to pass around super long decimals everywhere, usually a step is passed in for the slider.
     * This function will take the raw "new value", and return the clean one which is an integer multiple of the
     * provided "step" prop.
     * Additionally makes sure the value is within the rangeStart / rangeEnd parameters passed in.
     * @link https://github.com/jquery/jquery-ui/blob/master/ui/slider.js#L534-L552
     * @param val
     * @returns {Number}
     */
    cleanValue: function ( val ) {
        if (val <= this.props.range[0]) {
            return this.props.range[0];
        }
        if (val >= this.props.range[1]) {
            return this.props.range[1];
        }
        var step = this.props.step,
            valModStep = (val - this.props.range[0]) % step,
            alignValue = val - valModStep;

        if (Math.abs(valModStep) * 2 >= step) {
            alignValue += ( valModStep > 0 ) ? step : ( -step );
        }

        // Since JavaScript has problems with large floats, round
        // the final value to 5 digits after the decimal point
        return parseFloat(alignValue.toFixed(5));
    },

    handleMouseMove: function ( e, initialX, initialValue ) {
        event.preventDefault();

        var newX = (event.originalEvent && event.originalEvent.touches ? event.originalEvent.touches[0] : event).clientX;

        var width = dom.outerWidth(this.refs.slider.getDOMNode());

        var delta = newX - initialX;

        var changeInValue = (delta / width) * (this.props.range[1] - this.props.range[0]);

        var newValue = this.cleanValue(initialValue + changeInValue);

        this.getValueLink().requestChange(newValue);
    },

    handleMouseDown: function ( e ) {
        var initialX = (e.touches ? e.touches[0] : e).clientX;
        var initialValue = this.getValueLink().value;

        var mouseDownHelper = ( event ) => {
            this.handleMouseMove(event, initialX, initialValue);
        };

        var cancel = () => {
            dom.ignoreEvent(document, "mousemove", mouseDownHelper);
            dom.ignoreEvent(document, "touchmove", mouseDownHelper);

            dom.ignoreEvent(document, "mouseup", cancel);
            dom.ignoreEvent(document, "touchend", cancel);
        };

        dom.listenToEvent(document, "mousemove", mouseDownHelper);
        dom.listenToEvent(document, "touchmove", mouseDownHelper);

        dom.listenToEvent(document, "mouseup", cancel);
        dom.listenToEvent(document, "touchend", cancel);
    },

    render: function () {

        var value = this.getValueLink().value;

        if (value === undefined) {
            value = this.props.range[0];
        }

        var percent = (value - this.props.range[0]) / (this.props.range[1] - this.props.range[0]) * 100;

        var sliderStyle = {
            backgroundColor: this.props.barColor,
            width: this.props.size || 'auto',
            display: this.props.size ? 'inline-block' : 'block'
        };

        var barStyle = {
            width: `${percent}%`,
            backgroundColor: this.props.barFillColor
        };

        var handleStyle = {
            left: `${percent}%`
        };

        var sliderClass = classNames("slider", this.props.className);
        var handleClass = classNames("slider-handle", this.props.handleClass);

        return (
            <div ref="slider" className={sliderClass} style={sliderStyle}>
                <div className="slider-bar" style={barStyle} />
                <a ref="handle"
                    className={handleClass}
                    style={handleStyle}
                    onTouchStart={this.handleMouseDown}
                    onMouseDown={this.handleMouseDown}
                ></a>
            </div>
        );
    }

});

module.exports = Slider;