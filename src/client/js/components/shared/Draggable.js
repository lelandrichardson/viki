var React = require('react/addons');
var emptyFunction = require('react/lib/emptyFunction');
var CX = React.addons.classSet;
var dom = require('../../util/dom');

function createUIEvent(draggable) {
    return {
        position: {
            top: draggable.state.clientY,
            left: draggable.state.clientX,
            dWidth: draggable.state.dWidth,
            dHeight: draggable.state.dHeight
        }
    };
}

function canDragY(draggable) {
    return draggable.props.axis === 'both' ||
        draggable.props.axis === 'y';
}

function canDragX(draggable) {
    return draggable.props.axis === 'both' ||
        draggable.props.axis === 'x';
}

// @credits: http://stackoverflow.com/questions/4817029/whats-the-best-way-to-detect-a-touch-screen-device-using-javascript/4819886#4819886
/* Conditional to fix node server side rendering of component */
if (typeof window === 'undefined') {
    // Do Node Stuff
    var isTouchDevice = false;
} else {
    // Do Browser Stuff
    var isTouchDevice = 'ontouchstart' in window // works on most browsers
        || 'onmsgesturechange' in window; // works on ie10 on ms surface

}

// look ::handleDragStart
//function isMultiTouch(e) {
//  return e.touches && Array.isArray(e.touches) && e.touches.length > 1
//}

/**
 * simple abstraction for dragging events names
 * */
var dragEventFor = (function () {
    var eventsFor = {
        touch: {
            start: 'touchstart',
            move: 'touchmove',
            end: 'touchend'
        },
        mouse: {
            start: 'mousedown',
            move: 'mousemove',
            end: 'mouseup'
        }
    };
    return eventsFor[isTouchDevice ? 'touch' : 'mouse'];
})();

/**
 * get {clientX, clientY} positions of control
 * */
function getControlPosition(e) {
    var position = !isTouchDevice ? e : e.touches[0];
    return {
        clientX: position.clientX,
        clientY: position.clientY
    }
}

module.exports = React.createClass({
    displayName: 'Draggable',

    propTypes: {
        /**
         * `axis` determines which axis the draggable can move.
         *
         * 'both' allows movement horizontally and vertically.
         * 'x' limits movement to horizontal axis.
         * 'y' limits movement to vertical axis.
         *
         * Defaults to 'both'.
         */
        axis: React.PropTypes.oneOf(['both', 'x', 'y']),

        /**
         * `handle` specifies a selector to be used as the handle that initiates drag.
         *
         * Example:
         *
         * ```jsx
         * 	var App = React.createClass({
		 * 	    render: function () {
		 * 	    	return (
		 * 	    	 	<Draggable handle=".handle">
		 * 	    	 	  <div>
		 * 	    	 	      <div className="handle">Click me to drag</div>
		 * 	    	 	      <div>This is some other content</div>
		 * 	    	 	  </div>
		 * 	    		</Draggable>
		 * 	    	);
		 * 	    }
		 * 	});
         * ```
         */
        dragHandle: React.PropTypes.string,

        resizeHandle: React.PropTypes.string,

        /**
         * `cancel` specifies a selector to be used to prevent drag initialization.
         *
         * Example:
         *
         * ```jsx
         * 	var App = React.createClass({
		 * 	    render: function () {
		 * 	        return(
		 * 	            <Draggable cancel=".cancel">
		 * 	                <div>
		 * 	                	<div className="cancel">You can't drag from here</div>
		 *						<div>Dragging here works fine</div>
		 * 	                </div>
		 * 	            </Draggable>
		 * 	        );
		 * 	    }
		 * 	});
         * ```
         */
        cancel: React.PropTypes.string,

        /**
         * `grid` specifies the x and y that dragging should snap to.
         *
         * Example:
         *
         * ```jsx
         * 	var App = React.createClass({
		 * 	    render: function () {
		 * 	        return (
		 * 	            <Draggable grid={[25, 25]}>
		 * 	                <div>I snap to a 25 x 25 grid</div>
		 * 	            </Draggable>
		 * 	        );
		 * 	    }
		 * 	});
         * ```
         */
        grid: React.PropTypes.arrayOf(React.PropTypes.number),

        /**
         * `start` specifies the x and y that the dragged item should start at
         *
         * Example:
         *
         * ```jsx
         * 	var App = React.createClass({
		 * 	    render: function () {
		 * 	        return (
		 * 	            <Draggable start={{x: 25, y: 25}}>
		 * 	                <div>I start with left: 25px; top: 25px;</div>
		 * 	            </Draggable>
		 * 	        );
		 * 	    }
		 * 	});
         * ```
         */
        start: React.PropTypes.object,

        /**
         * `zIndex` specifies the zIndex to use while dragging.
         *
         * Example:
         *
         * ```jsx
         * 	var App = React.createClass({
		 * 	    render: function () {
		 * 	        return (
		 * 	            <Draggable zIndex={100}>
		 * 	                <div>I have a zIndex</div>
		 * 	            </Draggable>
		 * 	        );
		 * 	    }
		 * 	});
         * ```
         */
        zIndex: React.PropTypes.number,

        /**
         * Called when dragging starts.
         *
         * Example:
         *
         * ```js
         *	function (event, ui) {}
         * ```
         *
         * `event` is the Event that was triggered.
         * `ui` is an object:
         *
         * ```js
         *	{
		 *		position: {top: 0, left: 0}
		 *	}
         * ```
         */
        onDragStart: React.PropTypes.func,
        onResizeStart: React.PropTypes.func,

        /**
         * Called while dragging.
         *
         * Example:
         *
         * ```js
         *	function (event, ui) {}
         * ```
         *
         * `event` is the Event that was triggered.
         * `ui` is an object:
         *
         * ```js
         *	{
		 *		position: {top: 0, left: 0}
		 *	}
         * ```
         */
        onDrag: React.PropTypes.func,
        onResize: React.PropTypes.func,

        /**
         * Called when dragging stops.
         *
         * Example:
         *
         * ```js
         *	function (event, ui) {}
         * ```
         *
         * `event` is the Event that was triggered.
         * `ui` is an object:
         *
         * ```js
         *	{
		 *		position: {top: 0, left: 0}
		 *	}
         * ```
         */
        onDragStop: React.PropTypes.func,
        onResizeStop: React.PropTypes.func,

        /**
         * A workaround option which can be passed if onMouseDown needs to be accessed, since it'll always be blocked (due to that there's internal use of onMouseDown)
         *
         */
        onMouseDown: React.PropTypes.func
    },

    componentWillUnmount: function() {
        // Remove any leftover event handlers
        dom.ignoreEvent(window, dragEventFor['move'], this.handleDrag);
        dom.ignoreEvent(window, dragEventFor['end'], this.handleDragEnd);
    },

    getDefaultProps: function () {
        return {
            axis: 'both',
            handle: null,
            cancel: null,
            grid: null,
            start: {
                x: 0,
                y: 0
            },
            zIndex: NaN,
            onDragStart: emptyFunction,
            onDrag: emptyFunction,
            onDragStop: emptyFunction,
            onResizeStart: emptyFunction,
            onResize: emptyFunction,
            onResizeStop: emptyFunction,
            onMouseDown: emptyFunction
        };
    },

    getInitialState: function () {
        return {
            // Whether or not currently dragging
            dragging: false,

            resizing: false,

            // Start top/left of this.getDOMNode()
            startX: 0, startY: 0,

            // Offset between start top/left and mouse top/left
            offsetX: 0, offsetY: 0,

            // Current top/left of this.getDOMNode()
            clientX: this.props.start.x, clientY: this.props.start.y
        };
    },

    handleDragStart: function (e) {
        // todo: write right implementation to prevent multitouch drag
        // prevent multi-touch events
        // if (isMultiTouch(e)) {
        //     this.handleDragEnd.apply(e, arguments);
        //     return
        // }

        // Make it possible to attach event handlers on top of this one
        this.props.onMouseDown(e);

        var node = this.getDOMNode();

        var matchesDrag = (!this.props.dragHandle || dom.matches(e.target, this.props.dragHandle, true));
        var matchesResize = (!this.props.resizeHandle || dom.matches(e.target, this.props.resizeHandle, true));
        var matchesCancel = false; // TODO:

        if (matchesCancel || (!matchesDrag && !matchesResize)) {
            return;
        }

        var dragPoint = getControlPosition(e);

        // Initiate dragging
        this.setState({
            dragging: matchesDrag,
            resizing: matchesResize,
            offsetX: parseInt(dragPoint.clientX, 10),
            offsetY: parseInt(dragPoint.clientY, 10),
            startX: parseInt(node.style.left, 10) || 0,
            startY: parseInt(node.style.top, 10) || 0
        });

        var startHandler = matchesDrag ? this.props.onDragStart : this.props.onResizeStart;

        // Call event handler
        startHandler(e, createUIEvent(this));

        // Add event handlers
        dom.listenToEvent(window, dragEventFor['move'], this.handleDrag);
        dom.listenToEvent(window, dragEventFor['end'], this.handleDragEnd);
    },

    handleDragEnd: function (e) {
        // Short circuit if not currently dragging
        var { dragging, resizing } = this.state;

        if (!dragging && !resizing) {
            return;
        }

        var stopHandler = dragging ? this.props.onDragStop : this.props.onResizeStop;

        // Turn off dragging
        this.setState({
            dragging: false,
            resizing: false
        });

        // Call event handler
        stopHandler(e, createUIEvent(this));

        // Remove event handlers
        dom.ignoreEvent(window, dragEventFor['move'], this.handleDrag);
        dom.ignoreEvent(window, dragEventFor['end'], this.handleDragEnd);
    },

    handleDrag: function (e) {
        var dragPoint = getControlPosition(e);

        // Calculate top and left
        var clientX = (this.state.startX + (dragPoint.clientX - this.state.offsetX));
        var clientY = (this.state.startY + (dragPoint.clientY - this.state.offsetY));

        // Snap to grid if prop has been provided
        if (Array.isArray(this.props.grid)) {
            var directionX = clientX < parseInt(this.state.clientX, 10) ? -1 : 1;
            var directionY = clientY < parseInt(this.state.clientY, 10) ? -1 : 1;

            clientX = Math.abs(clientX - parseInt(this.state.clientX, 10)) >= this.props.grid[0]
                ? (parseInt(this.state.clientX, 10) + (this.props.grid[0] * directionX))
                : this.state.clientX;

            clientY = Math.abs(clientY - parseInt(this.state.clientY, 10)) >= this.props.grid[1]
                ? (parseInt(this.state.clientY, 10) + (this.props.grid[1] * directionY))
                : this.state.clientY;
        }

        if (this.state.dragging) {
            // Update top and left
            this.setState({
                clientX: clientX,
                clientY: clientY
            });
        } else {
            this.setState({
                dWidth: clientX,
                dHeight: clientY
            });
        }


        // Call event handler
        var handler = this.state.dragging ? this.props.onDrag : this.props.onResize;

        handler(e, createUIEvent(this));
    },

    reset: function () {
        this.setState({
            clientX: this.props.start.x,
            clientY: this.props.start.y,
            dWidth: 0,
            dHeight: 0
        });
    },

    render: function () {
        var style = {
            // Set top if vertical drag is enabled
            top: canDragY(this)
                ? this.state.clientY
                : this.state.startY,

            // Set left if horizontal drag is enabled
            left: canDragX(this)
                ? this.state.clientX
                : this.state.startX
        };

        // Set zIndex if currently dragging and prop has been provided
        if (this.state.dragging && !isNaN(this.props.zIndex)) {
            style.zIndex = this.props.zIndex;
        }

        var className = CX({
            'react-draggable': true,
            'react-draggable-dragging': this.state.dragging
        });
        // Reuse the child provided
        // This makes it flexible to use whatever element is wanted (div, ul, etc)
        return React.addons.cloneWithProps(React.Children.only(this.props.children), {
            style: style,
            className: className,

            onMouseDown: this.handleDragStart,
            onTouchStart: function(ev){
                ev.preventDefault(); // prevent for scroll
                return this.handleDragStart.apply(this, arguments);
            }.bind(this),

            onMouseUp: this.handleDragEnd,
            onTouchEnd: this.handleDragEnd
        });
    }
});