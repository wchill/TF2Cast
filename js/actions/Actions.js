var AppDispatcher = require('../dispatcher/AppDispatcher');
var Constants = require('../constants/Constants');

var Actions = {
  reset: function() {
    AppDispatcher.handleViewAction({
      type: Constants.RESET
    });
  },

  playerDeath: function(data) {
    AppDispatcher.handleServerAction({
      type: Constants.DEATH,
      message: data
    });
  },

  playerConnect: function(data) {
    AppDispatcher.handleServerAction({
      type: Constants.CONNECT,
      message: data
    });
  },

  playerDisconnect: function(data) {
    AppDispatcher.handleServerAction({
      type: Constants.DISCONNECT,
      message: data
    });
  },

  playerUpdate: function(data) {
    AppDispatcher.handleServerAction({
      type: Constants.PLAYER_UPDATE,
      message: data
    });
  },

  teamUpdate: function(data) {
    AppDispatcher.handleServerAction({
      type: Constants.TEAM_UPDATE,
      message: data
    });
  },


  /************************************************* */

  bootstrap: function(data) {
    AppDispatcher.handleServerAction({
      type: Constants.BOOTSTRAP,
      message: data
    });
  },

  death: function(data) {
    AppDispatcher.handleServerAction({
      type: Constants.DEATH,
      message: data
    });
  },

  respawn: function(data) {
    AppDispatcher.handleServerAction({
      type: Constants.RESPAWN,
      message: data
    });
  },

  connected: function(data) {
    AppDispatcher.handleServerAction({
      type: Constants.CONNECTED,
      message: data
    });
  },

  disconnected: function(data) {
    AppDispatcher.handleServerAction({
      type: Constants.DISCONNECTED,
      message: data
    });
  },

  teamswitch: function(data) {
    AppDispatcher.handleServerAction({
      type: Constants.TEAM_SWITCH,
      message: data
    });
  },

  playerscores: function(data) {
    AppDispatcher.handleServerAction({
      type: Constants.PLAYERS_SCORES,
      message: data
    });
  },

  roundover: function(data) {
    AppDispatcher.handleServerAction({
      type: Constants.ROUND_OVER,
      message: data
    });
  },

  messageReceive: function(data) {
    AppDispatcher.handleServerAction({
      type: Constants.MESSAGE_RECEIVE,
      message: data
    });
  }

};

module.exports = Actions;
