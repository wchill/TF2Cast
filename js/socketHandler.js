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
    // socket.on('bootstrap', function(payload) {
    //   Actions.updateTeam();
    //   Actions.updateTeam();
    //
    //   payload.red_players.forEach(Actions.updatePlayer);
    //   payload.blu_players.forEach(Actions.updatePlayer);
    // });

    socket.on('death', Actions.playerDeath);
    socket.on('respawn', Actions.playerUpdate);
    socket.on('connected', Actions.playerConnect);
    socket.on('disconnected', Actions.playerDisconnect);
    socket.on('teamswitch', Actions.playerUpdate);
    socket.on('playerscores', function(payload) {
      payload.red_players.forEach(Actions.playerUpdate);
      payload.blu_players.forEach(Actions.playerUpdate);
    });
    socket.on('roundover', Actions.teamUpdate);
  }
};

module.exports = socketHandler;
