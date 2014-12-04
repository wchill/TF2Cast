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
  },

  // test the server
  test: function() {
    setTimeout(
      function() {
        socket.emit('test_client', 'aaa');
      },
      1000
    );

    setTimeout(
      function() {
        socket.emit('test_client', 'bbb');
      },
      2000
    );

    setTimeout(
      function() {
        socket.emit('test_client', 'ccc');
      },
      3000
    );
  }
};

module.exports = socketHandler;
