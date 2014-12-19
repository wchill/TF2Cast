var AppDispatcher = require('../dispatcher/AppDispatcher');
var Constants = require('../constants/Constants');

var Actions = {
  reset: function() {
    AppDispatcher.handleViewAction({
      type: Constants.RESET
    });
  },

  player_add: function(data) {
    AppDispatcher.handleServerAction({
      type: Constants.PLAYER_ADD,
      message: data
    });
  },

  player_delete: function(data) {
    AppDispatcher.handleServerAction({
      type: Constants.PLAYER_DELETE,
      message: data
    });
  },

  player_update: function(data) {
    AppDispatcher.handleServerAction({
      type: Constants.PLAYER_UPDATE,
      message: data
    });
  },

  player_death: function(data) {
    AppDispatcher.handleServerAction({
      type: Constants.PLAYER_DEATH,
      message: data
    });
  },

  team_update: function(data) {
    AppDispatcher.handleServerAction({
      type: Constants.TEAM_UPDATE,
      message: data
    });
  },

  scoreboard_init: function(data) {
    AppDispatcher.handleServerAction({
      type: Constants.SCOREBOARD_INIT,
      message: data
    });
  },

  scoreboard_reset: function(data) {
    AppDispatcher.handleServerAction({
      type: Constants.SCOREBOARD_RESET,
      message: data
    });
  },
};

module.exports = Actions;
