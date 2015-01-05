var React = require('react');

// Actions
var TopNavActions = require('../../actions/TopNavActions');
var AppActions = require('../../actions/AppActions');

// Components
var Link = require('react-router').Link;
var Icon = require('../shared/Icon').Icon;
var Draggable = require('react-draggable');

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

    handleEditClick: function () {
        AppActions.showModal("EDIT_ITEM", this.props.item);
    },

    dragStart: function ( event, ui ) {
        console.log("drag start");
    },

    dragStop: function ( event, ui ) {
        console.log(JSON.stringify(ui));
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

        return (
            <div className="page-item-wrapper" style={style.wrapper}>
                <Draggable onStop={this.dragStop} onStart={this.dragStart}>
                    <div className="page-item unselectable" style={style.item}>
                        <a className="left" onClick={this.handleEditClick}><Icon type="pencil"/></a>
                        <a className="right handle"><Icon type="arrows"/></a>
                        <div className="clearfix"></div>
                        <div>
                            {item}
                        </div>
                    </div>
                </Draggable>
            </div>
        );

        //return (
        //    <div className="page-item mb10">
        //        {item}
        //        <a onClick={this.handleEditClick}><Icon type="pencil"/></a>
        //        <a onClick={this.handleEditClick}><Icon type="move"/></a>
        //    </div>
        //);
    }

});

module.exports = PageItem;