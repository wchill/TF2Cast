var Actions = require('./actions/Actions');

var socket;

function getTeam(teamNum) {
  teamNum = +teamNum;
  switch(teamNum) {
    case -1:
      return 'none';
    case 0:
      return 'red';
    case 1:
      return 'blue';
    case 2:
      return 'spectator';
    case 3:
      return 'tie';
    default:
      return 'error';
  }
}

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

    socket.on('bootstrap', Actions.bootstrap);
    socket.on('death', Actions.death);
    socket.on('respawn', Actions.respawn);
    socket.on('connected', Actions.connected);
    socket.on('disconnected', Actions.disconnected);
    socket.on('teamswitch', Actions.teamswitch);
    socket.on('playerscores', Actions.playerscores);
    socket.on('roundover', Actions.roundover);
  }
};

module.exports = socketHandler;
