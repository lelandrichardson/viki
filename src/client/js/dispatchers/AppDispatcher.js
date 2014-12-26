var Dispatcher = require('./Dispatcher.js');

var AppDispatcher = Object.assign(Dispatcher.prototype, {
  handleViewAction: function(action){
    console.log('action', action);
    this.dispatch({
      source: 'VIEW_ACTION',
      action: action
    })
  }
})

module.exports = AppDispatcher;