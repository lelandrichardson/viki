var React = require('react');

var LoadingIndicator = React.createClass({

    propTypes: {
        active: React.PropTypes.bool.isRequired
    },

    render: function () {
        var style = Object.assign({}, this.props.style, { visible: this.props.active ? 'visible' : 'hidden' });
        return (
            <img {...this.props} style={style} src="/assets/images/loader.gif" width="32" height="24" />
        );
    }
});

module.exports = LoadingIndicator;