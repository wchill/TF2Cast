var EventEmitter = require('events').EventEmitter;
var AppDispatcher = require('../dispatcher/AppDispatcher');
var Constants = require('../constants/Constants');

var assign = require('react/lib/Object.assign');
var socketHandler = require('../socketHandler');

var messages = [];

function reset() {
  messages = [];
}

function addMessage(message) {
  messages.push(message);
}

var MessageStore = assign({}, EventEmitter.prototype, {

  getMessages: function() {
    return messages;
  },

  emitChange: function() {
    this.emit(Constants.CHANGE_EVENT);
  },

  addChangeListener: function(callback) {
    this.on(Constants.CHANGE_EVENT, callback);
  },

  removeChangeListener: function(callback) {
    this.removeListener(Constants.CHANGE_EVENT, callback);
  }
});

AppDispatcher.register(function(payload) {
  var action = payload.action;

  switch(action.type) {
    case Constants.MESSAGE_RECEIVE:
      addMessage(action.message);
      MessageStore.emitChange();
      break;

    case Constants.RESET:
      reset();
      MessageStore.emitChange();
      break;
  }

  return true;
});

module.exports = MessageStore;
