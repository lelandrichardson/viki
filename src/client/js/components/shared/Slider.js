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
         * The left-most value on the slider. Defaults to 0
         */
        rangeStart: React.PropTypes.number,

        /**
         * The right-most value on the slider. Defaults to 1
         */
        rangeEnd: React.PropTypes.number,

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
        size: React.PropTypes.number
    },

    getDefaultProps: function () {
        return {
            rangeStart: 0,
            rangeEnd: 1
        };
    },

    handleMouseMove: function ( e, initialX, initialValue ) {
        event.preventDefault();

        var newX = (event.originalEvent && event.originalEvent.touches ? event.originalEvent.touches[0] : event).clientX;

        var width = dom.outerWidth(this.refs.slider.getDOMNode());

        var delta = newX - initialX;

        var changeInValue = (delta / width) * (this.props.rangeEnd - this.props.rangeStart);

        var newValue = Math.max(Math.min(initialValue + changeInValue, this.props.rangeEnd), this.props.rangeStart);

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

        var percent = (value - this.props.rangeStart) / (this.props.rangeEnd - this.props.rangeStart) * 100;

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