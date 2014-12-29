var React = require('react');
var Router = require('react-router');
var routes = require('./routes');
var Transition = require('react-router/modules/utils/Transition');
var Dispatcher = require('./Dispatcher');

Object.assign(Transition.prototype, {
    waitFor: function ( constant ) {
        this.wait(new Promise(function ( resolve, reject ) {
            Dispatcher.register(constant + '_AFTER', resolve);
        }));
    }
});

Router.run(routes, Router.HistoryLocation, function ( Handler, state ) {

    React.render(<Handler/>, document.getElementById('main'));

    //// create the promises hash
    //var promises = state.routes.filter(function ( route ) {
    //    // gather up the handlers that have a static `fetchData` method
    //    return route.handler.fetchData;
    //}).reduce(function ( promises, route ) {
    //    // reduce to a hash of `key:promise`
    //    promises[route.name] = route.handler.fetchData(state.params);
    //    return promises;
    //}, {});
    //
    //resolveKeys(promises).then(function ( data ) {
    //    // wait until we have data to render, the old screen stays up until
    //    // we render
    //    React.render(<Handler data={data}/>, document.getElementById('main'));
    //}, function () {
    //    console.log("in router error...");
    //});

});