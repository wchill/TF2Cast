var Actions = require('./actions/Actions');

var socket;

var socketHandler = {
  init: function() {
    socket = require('socket.io-client')();

    socket.on('disconnect', function() {
      Actions.reset();
    });

    socket.on('bootstrap', Actions.bootstrap);
    socket.on('death', Actions.death);
    socket.on('respawn', Actions.respawn);
    socket.on('connected', Actions.connected);
    socket.on('disconnected', Actions.disconnected);
    socket.on('teamswitch', Actions.teamswitch);
    socket.on('playerscores', Actions.playerscores);
    socket.on('roundover', Actions.roundover);
    socket.on('player_summary', Actions.player_summary);
    socket.on('tf2_init', Actions.tf2_init);
  },

  getPlayerSummary: function(playerid) {
    socket.emit('get_player_summary', playerid);
  }
};

module.exports = socketHandler;
