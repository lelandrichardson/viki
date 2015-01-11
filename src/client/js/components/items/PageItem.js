var React = require('react');

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

function itemStyle ( item ) {
    var _style = {},
        style = function ( styles ) {
            Object.assign(_style, styles);
        };

    var { position, size } = item;

    position = position || {
        x: 40,
        y: 50
    };

    size = size || {
        width: 100,
        height: 200
    };

    style({
        top: `${position.y}%`,
        left: `${position.x}%`,
        marginLeft: `${-size.width / 2}px`,
        marginTop: `${-size.height / 2}px`,
        width: size.width,
        height: size.height
    });

    return {
        wrapper: _style,
        item: {
            width: size.width,
            height: size.height
        }
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

    dragStart: function ( event, ui ) {
        //console.log("drag start");
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
        var current = item.position || { x: 40, y: 50 };

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
        console.log(JSON.stringify(ui.position));
        var dWidth = ui.position.dWidth,
            dHeight = ui.position.dHeight;

        if (dWidth !== this.state.dWidth || dHeight !== this.state.dHeight) {
            this.setState({
                dWidth: dWidth,
                dHeight: dHeight
            });
        }
    },

    resizeStop: function ( event, ui ) {
        var item = this.props.item;
        var current = item.size || { width: 100, height: 200 };

        var itemToSave = Object.assign({}, item, {
            size: {
                width: current.width + ui.position.dWidth,
                height: current.height + ui.position.dHeight
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
                    onDragStart={this.dragStart}
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