var AppDispatcher = require('../dispatcher/AppDispatcher');
var Constants = require('../constants/Constants');

var Actions = {

  messageReceive: function(message) {
    AppDispatcher.handleServerAction({
      type: Constants.MESSAGE_RECEIVE,
      message: message
    });
  },

  messageSend: function(message) {
    AppDispatcher.handleViewAction({
      type: Constants.MESSAGE_SEND,
      message: message
    });
  },

  reset: function() {
    AppDispatcher.handleViewAction({
      type: Constants.RESET
    });
  },

  playerDeath: function(payload) {
    AppDispatcher.handleServerAction({
      type: Constants.DEATH,
      payload: payload
    });
  },

  playerConnect: function(payload) {
    AppDispatcher.handleServerAction({
      type: Constants.CONNECT,
      payload: payload
    });
  },

  playerDisconnect: function() {
    AppDispatcher.handleServerAction({
      type: Constants.DISCONNECT,
      payload: payload
    });
  },

  playerUpdate: function() {
    AppDispatcher.handleServerAction({
      type: Constants.PLAYER_UPDATE,
      payload: payload
    });
  },

  teamUpdate: function() {
    AppDispatcher.handleServerAction({
      type: Constants.TEAM_UPDATE,
      payload: payload
    });
  }
};

module.exports = Actions;
