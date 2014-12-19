var AppDispatcher = require('../dispatcher/AppDispatcher');
var Constants = require('../constants/Constants');

var Actions = {
  reset: function() {
    AppDispatcher.handleViewAction({
      type: Constants.RESET
    });
  },

  playerAdd: function(data) {
    AppDispatcher.handleServerAction({
      type: Constants.PLAYER_ADD,
      message: data
    });
  },

  playerDelete: function(data) {
    AppDispatcher.handleServerAction({
      type: Constants.PLAYER_DELETE,
      message: data
    });
  },

  playerUpdate: function(data) {
    AppDispatcher.handleServerAction({
      type: Constants.PLAYER_UPDATE,
      message: data
    });
  },

  playerDeath: function(data) {
    AppDispatcher.handleServerAction({
      type: Constants.PLAYER_DEATH,
      message: data
    });
  },

  teamUpdate: function(data) {
    AppDispatcher.handleServerAction({
      type: Constants.TEAM_UPDATE,
      message: data
    });
  },

  scoreboardInit: function(data) {
    AppDispatcher.handleServerAction({
      type: Constants.SCOREBOARD_INIT,
      message: data
    });
  },

  scoreboardReset: function(data) {
    AppDispatcher.handleServerAction({
      type: Constants.SCOREBOARD_RESET,
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
