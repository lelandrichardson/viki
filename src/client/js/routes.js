var React = require('react');
var Router = require('react-router');
var { Route, NotFoundRoute, DefaultRoute, RouteHandler } = Router;

var VikiApp = require('./components/VikiApp');
var Page = require('./components/sections/Page');
var DefaultPage = require('./components/sections/DefaultPage');
var PageNotFound = require('./components/sections/PageNotFound');

var routes = (
    <Route name="app" path="/" handler={VikiApp}>
        <Route name="page-detail" path="p/:pageId" handler={Page}/>
        <Route name="getting-started" path="getting-started" handler={PageNotFound}/>
        <DefaultRoute name="root-page" handler={DefaultPage} />
        <NotFoundRoute name="page-not-found" handler={PageNotFound}/>
    </Route>
);

module.exports = routes;