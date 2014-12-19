var Actions = require('./actions/Actions');

var socket;

var socketHandler = {
  init: function() {
    socket = require('socket.io-client')();

    socket.on('disconnect', function() {
      Actions.reset();
    });

    socket.on('player_add', Actions.player_add);
    socket.on('player_delete', Actions.player_delete);
    socket.on('player_update', Actions.player_update);
    socket.on('player_death', Actions.player_death);
    socket.on('team_update', Actions.team_update);
    socket.on('scoreboard_init', Actions.scoreboard_init);
    socket.on('scoreboard_reset', Actions.scoreboard_reset);
  }
};

module.exports = socketHandler;
