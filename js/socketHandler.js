var Actions = require('./Actions/Actions');

var socket;

var socketHandler = {
  init: function() {
    socket = require('socket.io-client')();

    socket.on('disconnect', function() {
      Actions.reset();
    });

    socket.on('messages_from_server', function(messages) {
      messages.forEach(Actions.messageReceive);
    });

    socket.on('message_from_server', Actions.messageReceive);
  },

  sendMessage: function(message) {
    socket.emit('message_from_client', message);
  }
};

module.exports = socketHandler;
