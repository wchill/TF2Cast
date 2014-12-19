var AppDispatcher = require('../dispatcher/AppDispatcher');
var Constants = require('../constants/Constants');

var Actions = {
  reset: function() {
    AppDispatcher.handleViewAction({
      type: Constants.RESET
    });
  },

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
      type: Constants.PLAYER_SCORES,
      message: data
    });
  },

  roundover: function(data) {
    AppDispatcher.handleServerAction({
      type: Constants.ROUND_OVER,
      message: data
    });
  },

  player_summary: function(data) {
    AppDispatcher.handleServerAction({
      type: Constants.PLAYER_SUMMARY,
      message: data
    });
  },

  tf2_init: function(data) {
    AppDispatcher.handleServerAction({
      type: Constants.TF2_INIT,
      message: data
    });
  }

};

module.exports = Actions;
