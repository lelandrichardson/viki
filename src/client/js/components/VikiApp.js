var React = require('react');
var TopNav = require('./sections/TopNav');
var ModalManager = require('./sections/ModalManager');
var RouteHandler = require('react-router').RouteHandler;
var TooltipManager = require('./shared/Tooltip').TooltipManager;

var VikiApp = React.createClass({

    render: function () {
        return (
            <div>
                <TopNav />
                <ModalManager />
                <RouteHandler />
                <TooltipManager />
            </div>
        );
    }

});

module.exports = VikiApp;