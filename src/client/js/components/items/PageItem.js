var React = require('react');

// Utilities
var dom = require('../../util/dom');

// Actions
var TopNavActions = require('../../actions/TopNavActions');
var AppActions = require('../../actions/AppActions');
var ItemActions = require('../../actions/ItemActions');

// Stores
var PageStore = require('../../stores/PageStore');

// Components
var Link = require('react-router').Link;
var Icon = require('../shared/Icon').Icon;
var Draggable = require('../shared/Draggable');

// Constants
var MIN_ITEM_WIDTH = 30;
var MIN_ITEM_HEIGHT = 30;
var DEFAULT_ITEM_SIZE = {
    width: 100,
    height: 200
};
var DEFAULT_ITEM_POSITION = {
    x: 50,
    y: 50
};

function itemStyle ( item ) {
    var _wrapper = {},
        _style = {},
        wrapper = function ( styles ) {
            Object.assign(_wrapper, styles);
        },
        style = function ( styles ) {
            Object.assign(_style, styles);
        };

    var { position, size } = item;

    position = position || DEFAULT_ITEM_POSITION;

    size = size || DEFAULT_ITEM_SIZE;

    wrapper({
        top: `${position.y}%`,
        left: `${position.x}%`,
        marginLeft: `${-size.width / 2}px`,
        marginTop: `${-size.height / 2}px`,
        width: size.width,
        height: size.height
    });

    style({
        width: size.width,
        height: size.height,
        backgroundColor: item.backgroundColor,
        borderRadius: item.borderRadius
    });

    return {
        wrapper: _wrapper,
        item: _style
    };
}

var PageItem = React.createClass({

    propTypes: {
        item: React.PropTypes.object.isRequired
    },

    getInitialState: function () {
        return {
            dWidth: 0,
            dHeight: 0
        };
    },

    handleEditClick: function () {
        AppActions.showModal("EDIT_ITEM", this.props.item);
    },

    componentWillReceiveProps: function () {
        this.refs.draggable.reset();
        this.setState({
            dWidth: 0,
            dHeight: 0
        });
    },

    dragStop: function ( event, ui ) {
        // ui.position is in terms of change in position, by pixels.
        var pageFrame = dom.closest(event.target, ".page-frame");
        var pageX = dom.outerWidth(pageFrame);
        var pageY = dom.outerHeight(pageFrame);
        var item = this.props.item;
        var current = item.position || DEFAULT_ITEM_POSITION;

        var dX = (ui.position.left / pageX) * 100;
        var dY = (ui.position.top / pageY) * 100;

        var itemToSave = Object.assign({}, item, {
            position: {
                x: current.x + dX,
                y: current.y + dY
            }
        });

        ItemActions.update(item._id, itemToSave);
    },

    resize: function ( event, ui ) {
        // we simply update the width/height in CSS until the resizing stops
        var dWidth = ui.position.dWidth,
            dHeight = ui.position.dHeight,
            current = this.props.item.size || DEFAULT_ITEM_SIZE;

        // don't update if size hasn't changed
        if (dWidth === this.state.dWidth && dHeight === this.state.dHeight) {
            return;
        }

        // don't let the item get too small... or negative in size
        if (current.width + dWidth < MIN_ITEM_WIDTH) {
            dWidth = MIN_ITEM_WIDTH - current.width;
        }

        if (current.height + dHeight < MIN_ITEM_HEIGHT) {
            dHeight = MIN_ITEM_HEIGHT - current.height;
        }

        this.setState({
            dWidth: dWidth,
            dHeight: dHeight
        });

    },

    resizeStop: function ( event, ui ) {

        var pageFrame = dom.closest(event.target, ".page-frame");
        var pageX = dom.outerWidth(pageFrame);
        var pageY = dom.outerHeight(pageFrame);

        var item = this.props.item;
        var current = item.size || DEFAULT_ITEM_SIZE;
        var position = item.position || DEFAULT_ITEM_POSITION;

        var dX = (ui.position.dWidth / pageX) * 100;
        var dY = (ui.position.dHeight / pageY) * 100;

        var itemToSave = Object.assign({}, item, {
            size: {
                width: Math.max(current.width + ui.position.dWidth, MIN_ITEM_WIDTH),
                height: Math.max(current.height + ui.position.dHeight, MIN_ITEM_HEIGHT)
            },
            position: {
                x: position.x + dX / 2,
                y: position.y + dY / 2
            }
        });

        ItemActions.update(item._id, itemToSave);
    },

    render: function () {

        var item = this.props.item.linkTo ? (
            <Link className="text-large" to="page" params={{ pageId: this.props.item.linkTo }}>
                {this.props.item.text}
            </Link>
        ) : (
            <span className="text-large">{this.props.item.text}</span>
        );

        var style = itemStyle(this.props.item);

        style.item.width += this.state.dWidth;
        style.item.height += this.state.dHeight;
        style.wrapper.width += this.state.dWidth;
        style.wrapper.height += this.state.dHeight;

        return (
            <div className="page-item-wrapper" style={style.wrapper}>
                <Draggable
                    ref="draggable"
                    onDragStop={this.dragStop}
                    onResize={this.resize}
                    onResizeStop={this.resizeStop}
                    dragHandle=".handle-move"
                    resizeHandle=".handle-resize">
                    <div className="page-item unselectable" style={style.item}>
                        <a className="left" onClick={this.handleEditClick}>
                            <Icon type="pencil"/>
                        </a>
                        <a className="right handle-move">
                            <Icon type="arrows"/>
                        </a>
                        <a className="handle-resize">
                            <Icon type="location-arrow"/>
                        </a>
                        <div className="clearfix"></div>
                        <div>
                            {item}
                        </div>
                    </div>
                </Draggable>
            </div>
        );
    }
});

module.exports = PageItem;