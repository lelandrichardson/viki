var EventEmitter = require('events').EventEmitter;
var merge = require('react/lib/merge');

var AppEvents = merge(EventEmitter.prototype, {

});

module.exports = AppEvents;