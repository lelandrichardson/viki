var React = require('react');

var Icon = require('./Icon').Icon;

var classNames = require('../../util/classNames');

var Tab = React.createClass({

    propTypes: {
        active: React.PropTypes.bool,
        icon: React.PropTypes.string,
        onClick: React.PropTypes.func.isRequired
    },

    getDefaultProps: function () {
        return {
            active: false
        };
    },

    render: function () {

        var className = classNames({
            tab: true,
            active: this.props.active
        });

        return (
            <li className={className}>
                <a className="tab-button" onClick={this.props.onClick}>
                    <Icon type={this.props.icon} />
                </a>
            </li>
        );
    }
});

var TabPane = React.createClass({

    propTypes: {
        active: React.PropTypes.bool,
        icon: React.PropTypes.string.isRequired
    },

    getDefaultProps: function () {
        return {
            active: false
        };
    },

    render: function () {

        var className = classNames({
            "tab-pane": true,
            "body": true,
            "active": this.props.active
        });

        return (
            <section {...this.props} className={className}>
                {this.props.children}
            </section>
        );
    }
});

var VerticalTabs = React.createClass({

    propTypes: {
        onChange: React.PropTypes.func,
        defaultIndex: React.PropTypes.number
    },

    getInitialState: function () {
        return {
            active: this.props.defaultIndex || 0
        };
    },

    tabClick: function ( index ) {
        this.setState({ active: index });
    },

    render: function () {

        var tabs = React.Children.map(this.props.children, this.renderTab, this);

        var panes = React.Children.map(this.props.children, this.renderPane, this);

        return (
            <div className="mb vertical-tabs">
                <ul className="tabs media">
                    {tabs}
                </ul>
                {panes}
            </div>
        );
    },

    renderPane: function ( item, index, array ) {
        return (
            <TabPane
                {...item.props}
                key={index}
                active={this.state.active === index}
            >{item.props.children}</TabPane>
        );
    },

    renderTab: function ( item, index, array ) {
        return (
            <Tab
                {...item.props}
                key={index}
                icon={item.props.icon}
                onClick={this.tabClick.bind(this, index)}
                active={this.state.active === index}
            />
        );
    }
});

module.exports = {
    VerticalTabs: VerticalTabs,
    Tab: Tab,
    TabPane: TabPane
};