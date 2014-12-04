var AppDispatcher = require('../dispatcher/AppDispatcher');
var Constants = require('../constants/Constants');

var Actions = {
  
  messageReceive: function(message) {
    AppDispatcher.handleServerAction({
      actionType: Constants.MESSAGE_RECEIVE,
      message: message
    });
  },

  messageSend: function(message) {
    AppDispatcher.handleViewAction({
      actionType: Constants.MESSAGE_SEND,
      message: message
    });
  },

  reset: function() {
    AppDispatcher.handleViewAction({
      actionType: Constants.RESET
    });
  }

};

module.exports = Actions;