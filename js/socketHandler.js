var Actions = require('./actions/Actions');

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

    socket.on('player_add', Actions.playerAdd);
    socket.on('player_delete', Actions.playerDelete);
    socket.on('player_update', Actions.playerUpdate);
    socket.on('player_death', Actions.playerDeath);
    socket.on('team_update', Actions.teamUpdate);
    socket.on('scoreboard_init', Actions.scoreboardInit);
    socket.on('scoreboard_reset', Actions.scoreboardReset);
  }
};

module.exports = socketHandler;
