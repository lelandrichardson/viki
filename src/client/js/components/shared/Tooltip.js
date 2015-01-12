var React = require('react/addons');
var dom = require('../../util/dom');
var classNames = require('../../util/classNames');
var TransitionGroup = React.addons.TransitionGroup;

var AppEvents = require('../../AppEvents');
var Eventable = require('../../mixins/Eventable');

var ARROW_WIDTH = 10;
var ARROW_HEIGHT = 10;

function getState ( el, tooltip ) {
    var s = {};
    var elementHeight = dom.outerHeight(el);
    var elementWidth = dom.outerWidth(el);
    var o = dom.offset(el);
    s.height = dom.outerHeight(tooltip, true);
    s.width = dom.outerWidth(tooltip, true);
    s.offset = {};
    s.offset.top = o.top;
    s.offset.left = o.left;
    s.offset.right = s.offset.left + elementWidth;
    s.offset.bottom = s.offset.top + elementHeight;
    s.offset.hCenter = s.offset.left + Math.floor(elementWidth / 2);
    s.offset.vCenter = s.offset.top + Math.floor(elementHeight / 2);
    s.css = {};
    s.on = {};
    s.off = {};
    s.arrow = {};
    return s;
}

function checkBounds ( s, direction, margin, slide ) {
    var bound,
        alternate,
        win = window,
        doc = win.document.documentElement;
    margin = parseInt(margin, 10);
    slide = parseInt(slide, 10);
    switch ( direction ) {
        case 'top':
            bound = win.pageYOffset;
            if (s.offset.top - s.height - margin - slide < bound) {
                alternate = 'bottom';
            }
            s.on.top = s.offset.top - s.height - margin;
            s.off.top = s.on.top + slide;
            s.css.top = s.on.top - slide;
            s.css.left = getCenter(s, true);
            break;
        case 'left':
            bound = win.pageXOffset;
            if (s.offset.left - s.width - margin - slide < bound) {
                alternate = 'right';
            }
            s.on.left = s.offset.left - s.width - margin;
            s.off.left = s.on.left + slide;
            s.css.top = getCenter(s, false);
            s.css.left = s.on.left - slide;
            break;
        case 'bottom':
            bound = win.pageYOffset + doc.clientHeight;
            if (s.offset.bottom + s.height + margin + slide > bound) {
                alternate = 'top';
            }
            s.on.top = s.offset.bottom + margin;
            s.off.top = s.offset.bottom - slide + margin;
            s.css.top = s.on.top + slide;
            s.css.left = getCenter(s, true);
            break;
        case 'right':
            bound = win.pageXOffset + doc.clientWidth;
            if (s.offset.right + s.width + margin + slide > bound) {
                alternate = 'left';
            }
            s.on.left = s.offset.right + margin;
            s.off.left = s.on.left - slide;
            s.css.left = s.on.left + slide;
            s.css.top = getCenter(s, false);
            break;
    }
    if (alternate && !s.over) {
        s.over = true;
        checkBounds(s, alternate, margin, slide);
    } else {
        s.direction = direction;
        getArrowOffset(s, direction);
        checkSlide(s, direction);
    }
}

function checkSlide ( s, dir ) {
    var offset,
        win = window,
        doc = win.document.documentElement;
    if (dir == 'top' || dir == 'bottom') {
        offset = win.pageXOffset - s.css.left + 5;
        if (offset > 0) {
            s.css.left += Math.abs(offset);
            s.arrow.left -= offset;
        }
        offset = (s.css.left + s.width) - (win.pageXOffset + doc.clientWidth) + 5;
        if (offset > 0) {
            s.css.left -= Math.abs(offset);
            s.arrow.left += offset;
        }
    } else if (dir == 'left' || dir == 'right') {
        offset = win.pageYOffset - s.css.top + 5;
        if (offset > 0) {
            s.css.top += Math.abs(offset);
            s.arrow.top -= offset;
        }
        offset = (s.css.top + s.height) - (win.pageYOffset + doc.clientHeight) + 5;
        if (offset > 0) {
            s.css.top -= Math.abs(offset);
            s.arrow.top += offset;
        }
    }
}

function getCenter ( s, horizontal ) {
    if (horizontal) {
        return s.offset.hCenter + (-s.width / 2);
    } else {
        return s.offset.vCenter + (-s.height / 2);
    }
}

function getArrowOffset ( s, dir ) {
    if (dir == 'left' || dir == 'right') {
        s.arrow.top = Math.floor((s.height / 2) - (ARROW_HEIGHT / 2));
    } else {
        s.arrow.left = Math.floor((s.width / 2) - (ARROW_WIDTH / 2));
    }
    s.arrow[getInverseDirection(dir)] = -ARROW_HEIGHT;
}

function getInverseDirection ( dir ) {
    switch ( dir ) {
        case 'top':
            return 'bottom';
        case 'bottom':
            return 'top';
        case 'left':
            return 'right';
        case 'right':
            return 'left';
    }
}

var Tip = React.createClass({

    propTypes: {
        tip: React.PropTypes.string,
        render: React.PropTypes.func,
        el: React.PropTypes.any,
        color: React.PropTypes.string,
        direction: React.PropTypes.string,
        margin: React.PropTypes.number,
        slide: React.PropTypes.number,
        mode: React.PropTypes.string
    },

    getDefaultProps: function () {
        return {
            margin: 8,
            slide: 10,
            color: "black",
            direction: "top",
            mode: "hover"
        };
    },

    eventData: function () {
        return Object.assign({}, this.props);
    },

    componentDidEnter: function () {

        var state = getState(this.props.el, this.getDOMNode());

        checkBounds(state, this.props.direction, this.props.margin, this.props.slide);

        this.setState({
            arrowCss: state.arrow,
            direction: state.direction,
            tipCss: Object.assign(state.css, state.on)
        });
    },

    handleMouseEnter: function () {
        AppEvents.emit("TOOLTIP_ACTIVATE", this.eventData());

    },

    handleMouseLeave: function () {
        AppEvents.emit("TOOLTIP_DEACTIVATE", this.eventData());
    },

    getInitialState: function () {
        return {
            arrowCss: {},
            tipCss: {
                visibility: 'hidden'
            }
        };
    },

    render: function () {
        var inner;

        if (this.props.tip) {
            inner = this.props.tip;
        } else if (this.props.render) {
            inner = this.props.render();
        }

        var listeners = {};
        switch ( this.props.mode ) {
            case "click":
                break;
            case "hover":
            default:
                listeners.onMouseEnter = this.handleMouseEnter;
                listeners.onMouseLeave = this.handleMouseLeave;
                break;
        }

        return (
            <div className={classNames("tooltip", this.props.color, this.state.direction)}
                style={this.state.tipCss} {...listeners}>
                <div className="arrow" style={this.state.arrowCss}/>
                <div>{inner}</div>
            </div>
        );
    }
});

var TooltipManager = React.createClass({

    mixins: [
        Eventable
    ],

    hideQueue: (function () {
        var queue = {};

        return {
            mark: function ( id, leeway, callback ) {
                queue[id] = setTimeout(callback, leeway);
            },
            cancel: function ( id ) {
                var timeoutId = queue[id];

                if (timeoutId) {
                    clearTimeout(timeoutId);
                }
            }
        };
    }()),

    subscriptions: {
        "TOOLTIP_ACTIVATE": function ( data ) {
            this.hideQueue.cancel(data.id);
            this.setModal(data.id, this.modalRenderFactory(data));
        },

        "TOOLTIP_DEACTIVATE": function ( data ) {
            this.hideQueue.mark(data.id, 25, () => {
                this.setModal(data.id, null);
            });
        }
    },

    getInitialState: function () {
        return {};
    },

    modalRenderFactory: function ( data ) {
        return () => {
            return (
                <Tip {...data} key={data.id} />
            );
        };
    },

    setModal: function ( id, modal ) {
        var state = {};
        state[id] = modal;
        this.setState(state);
    },

    render: function () {

        var tooltips = Object.keys(this.state)
            .map(k => this.state[k])
            .filter(t => !!t)
            .map(t => t());

        return (
            <TransitionGroup component="div" className="tooltips">
				{tooltips}
            </TransitionGroup>
        );
    }
});

var Tooltip = React.createClass({

    propTypes: {
        render: React.PropTypes.func,
        tip: React.PropTypes.string,
        color: React.PropTypes.string,
        direction: React.PropTypes.string,
        margin: React.PropTypes.number,
        slide: React.PropTypes.number,
        mode: React.PropTypes.oneOf(["click", "hover"])

        //TODO: add lifecycle events like onShow and onHide
    },

    eventData: function () {
        var el = this.getDOMNode();
        return Object.assign({}, this.props, {
            el: el,
            id: el.getAttribute("data-reactid")
        });
    },

    handleMouseEnter: function () {
        AppEvents.emit("TOOLTIP_ACTIVATE", this.eventData());
    },

    handleMouseLeave: function () {
        AppEvents.emit("TOOLTIP_DEACTIVATE", this.eventData());
    },

    handleClick: function () {
        AppEvents.emit("TOOLTIP_ACTIVATE", this.eventData());

        var deactivate = ( e ) => {
            if (dom.matches(e.target, ".tooltips", true)) {
                return;
            }

            AppEvents.emit("TOOLTIP_DEACTIVATE", this.eventData());

            dom.ignoreEvent(document, "mousedown", deactivate);
        };

        dom.listenToEvent(document, "mousedown", deactivate);

    },

    render: function () {

        var listeners = {};
        switch ( this.props.mode ) {
            case "click":
                listeners.onClick = this.handleClick;
                break;

            case "hover":
            default:
                listeners.onMouseEnter = this.handleMouseEnter;
                listeners.onMouseLeave = this.handleMouseLeave;
                break;
        }

        return React.addons.cloneWithProps(
            React.Children.only(this.props.children), listeners);
    }
});

module.exports = {
    Tooltip: Tooltip,
    TooltipManager: TooltipManager,
    Tip: Tip
};