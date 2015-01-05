var React = require('react');

// Components
var Image = require('../shared/Image');

function pageToImageStyle ( page, screenWidth, screenHeight ) {
    var _img = {},
        img = function ( styles ) {
            Object.assign(_img, styles);
        };

    var {
        image,
        allowDistortion,
        allowScaling,
        allowScrollX,
        allowScrollY
        } = page;

    var aspectRatio = image.width / image.height;

    var width,
        height,
        shrinkBy;

    if (!allowDistortion) {
        // aspect ratio holds

        if (allowScaling) {
            // the image can appear larger or smaller than the original

            if (!allowScrollX) {
                // no horizontal scrolling, so width is true width up to screenWidth
                width = Math.min(image.width, screenWidth);
                height = width / aspectRatio;

                if (!allowScrollY && height > screenHeight) {
                    // vertical scrolling not allowed so we must shrink image more
                    shrinkBy = screenHeight / height;
                    width = width * shrinkBy;
                    height = height * shrinkBy;
                }

            } else {
                // horizontal scrolling is allowed
                height = Math.min(image.height, screenHeight);
                width = height * aspectRatio;

                if (!allowScrollY && width > screenWidth) {
                    // vertical scrolling not allowed so we must shrink image more
                    shrinkBy = screenWidth / width;
                    width = width * shrinkBy;
                    height = height * shrinkBy;
                }
            }

        } else {
            // the image has to appear with it's original dimensions
            width = image.width;
            height = image.height;
        }

    } else {
        // distortion is allowed
        width = screenWidth;
        height = screenHeight;
    }

    img({
        width: width,
        height: height
    });

    if (width < screenWidth) {
        // center image horizontally by using margin: auto
        img({
            marginLeft: 'auto',
            marginRight: 'auto'
        });
    } else {
        // center image horizontally using negative margins
        img({
            marginLeft: (screenWidth - width) / 2
        });
    }

    // center image vertically
    img({
        marginTop: (screenHeight - height) / 2
    });

    return {
        image: _img,

        xDraggable: width > screenWidth,
        xMaxDrag: (width - screenWidth) / 2,

        yDraggable: height > screenHeight,
        yMaxDrag: (height - screenHeight) / 2
    };
}

function getWindowSize () {
    var w = window,
        d = document,
        e = d.documentElement,
        g = document.body || d.getElementsByTagName('body')[0];

    return {
        screenWidth: w.innerWidth || e.clientWidth || g.clientWidth,
        screenHeight: w.innerHeight || e.clientHeight || g.clientHeight
    };
}

function listenToEvent ( el, event, handler ) {
    if (el.addEventListener) {
        el.addEventListener(event, handler, false);
    } else if (el.attachEvent) {
        el.attachEvent("on" + event, handler);
    }
}

function ignoreEvent ( el, event, handler ) {
    if (el.removeEventListener) {
        el.removeEventListener(event, handler, false);
    } else if (el.detachEvent) {
        el.detachEvent("on" + event, handler);
    }
}

function position ( e ) {
    // touch event
    if (e.targetTouches && (e.targetTouches.length >= 1)) {
        return {
            y: e.targetTouches[0].clientY,
            x: e.targetTouches[0].clientX
        };
    }

    // mouse event
    return {
        x: e.clientX,
        y: e.clientY
    };
}

var PageImage = React.createClass({

    propTypes: {
        page: React.PropTypes.object.isRequired
    },

    getInitialState: function () {
        var w = getWindowSize();
        var style = pageToImageStyle(this.props.page, w.screenWidth, w.screenHeight);
        return {
            dragging: false,
            offset: { x: 0, y: 0 },
            reference: { x: 0, y: 0 },
            screenWidth: w.screenWidth,
            screenHeight: w.screenHeight,
            xMaxDrag: style.xMaxDrag,
            yMaxDrag: style.yMaxDrag
        };
    },

    handleWindowResize: function () {
        this.setState(getWindowSize());
    },

    handleStart: function ( e ) {
        this.setState({
            dragging: true,
            reference: position(e)
        });
    },

    handleDrag: function ( e ) {

        if (this.state.dragging) {
            var pos = position(e);
            var deltaX = this.state.reference.x - pos.x;
            var deltaY = this.state.reference.y - pos.y;

            this.scroll(pos, {
                x: this.state.offset.x + deltaX,
                y: this.state.offset.y + deltaY
            });
        }

        e.preventDefault();
        e.stopPropagation();
    },

    handleStop: function ( e ) {
        this.setState({
            dragging: false
        });
    },

    scroll: function ( reference, delta ) {
        var max = {
            x: this.state.xMaxDrag,
            y: this.state.yMaxDrag
        };
        var min = {
            x: -1 * max.x,
            y: -1 * max.y
        };

        this.setState({
            reference: reference,
            offset: {
                x: delta.x > max.x ? max.x : (delta.x < min.x) ? min.x : delta.x,
                y: delta.y > max.y ? max.y : (delta.y < min.y) ? min.y : delta.y
            }
        });
    },

    componentWillMount: function () {
        listenToEvent(window, "resize", this.handleWindowResize);
    },

    componentWillUnmount: function () {
        ignoreEvent(window, "resize", this.handleWindowResize);
    },

    render: function () {

        if (!this.props.page.image) {
            return false;
        }

        var style = pageToImageStyle(this.props.page, this.state.screenWidth, this.state.screenHeight);

        if (style.xDraggable) {

            Object.assign(style.image, {
                transform: `translateX(${-this.state.offset.x}px)`
            });
        }

        if (style.yDraggable) {
            Object.assign(style.image, {
                transform: `translateY(${-this.state.offset.y}px)`
            });
        }

        /*



         */

        return (
            <div className="page-lens unselectable">
                <div className="page-frame unselectable" style={style.image}>
                    <Image className="page-img unselectable"
                        image={this.props.page.image}
                        width={style.image.width}
                        height={style.image.height}

                        onMouseDown={this.handleStart}
                        onMouseMove={this.handleDrag}
                        onMouseUp={this.handleStop}

                        onTouchStart={this.handleStart}
                        onTouchMove={this.handleDrag}
                        onTouchMove={this.handleStop}
                    />
                    {this.props.children}
                </div>
            </div>
        );
    }

});

module.exports = PageImage;