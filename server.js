var express = require('express')
  , bodyParser      = require('body-parser')
  , json            = require('json')
  , urlencode       = require('urlencode');
var app = express();
var server = require('http').Server(app);
server.listen(8000);
var io = require('socket.io')(server);
var request = require('request');
app.use(bodyParser());
var Steam = require('./js/utils/steam');
var Constants = require('./js/constants/Constants');
var xhr = require('./utils/xhr');

var _messages = [];

function isValidTeam(teamid) {
  return [Constants.RED, Constants.BLU, Constants.SPEC].indexOf(teamid) > -1;
}

function resetMessages() {
  _messages = [
    {text: 'Welcome to team fortress 2 Stream!', id: 0}
  ];
}
function createMessage(text) {
  var newMessage = {text: text, id: _messages.length};
  _messages.push(newMessage);
  return newMessage;
}

app.use('/', express.static(__dirname));

io.on('connection', function(socket) {
  resetMessages();
  socket.emit('messages_from_server', _messages);

  socket.on('test_client', function(str) {
    io.emit('message_from_server', createMessage(str));
  });

  socket.on('get_player_summary', function(player) {
    var url = Steam.getPlayerSummaryURL(player);

    var userRequest = xhr('GET', url);
    
    userRequest.success(function(data) {
      var _player = data.response.players[0];
      io.emit('player_summary', {
        player: player,
        name : _player.personaname,
        avatar : _player.avatar
      });
    });
    userRequest.error(function(data) {
      io.emit('player_summary', {
        player: player,
        name : '',
        avatar : ''
      });
      console.log('error');
    });
  })
});

app.post('/api/private/bootstrap', function(req, res) {
  var b = req.body;
  var _errors = [];

  if (!(b.red_players && b.blu_players && b.spectators)) {
    _errors.push("Invalid team (or spectator) list.")
  }

  var _map_time = b.map_time || 0;
  if (_map_time < -1) {
	   _errors.push("Invalid map time.");
  }

  var _red_wins = b.red_wins || -1;
  if (_red_wins < 0) {
	   _errors.push("Invalid number of RED wins.");
  }

  var _blu_wins = b.blu_wins || -1;
  if (_blu_wins < 0) {
	   _errors.push("Invalid number of BLU wins.");
  }

  var tryConvertPlayerId = function(player) {
    if (!Steam.isValidID3(player.player)) {
      return;
    } else {
      player.player = Steam.convertID3ToID64(player.player);
    }
  }

  b.red_players.forEach(tryConvertPlayerId);
  b.blu_players.forEach(tryConvertPlayerId);
  b.spectators.forEach(tryConvertPlayerId);

  if (!_errors.length) {
    io.emit('bootstrap', b);
  }

  res.json(_errors);
});

app.post('/api/private/death', function(req, res) {
  var b = req.body;
  var _errors = [];

  if (!isValidTeam(b.victim_team)) {
	   _errors.push("Victim belongs to unknown team.");
  }

  if (!isValidTeam(b.attacker_team)) {
	   _errors.push("Attacker belongs to unknown team.");
  }

  if (b.assister_team && !isValidTeam(b.assister_team)) {
	   _errors.push("Assister belongs to unknown team.");
  }

  if (!Steam.areValidID3s([b.victiom, b.attacker, b.assister])) {
    /* pass */
  } else {
    b.victim = Steam.convertID3ToID64(b.victim);
    b.attacker = Steam.convertID3ToID64(b.attacker);
    if(b.assister) { b.assister = Steam.convertID3ToID64(b.assister); }
  }

  if(!_errors.length) {
    io.emit('death', b);
  }

  res.json(_errors);
});

app.post('/api/private/respawn', function(req, res) {
  var b = req.body;
  var _errors = [];

  if (!isValidTeam(b.team)) {
	   _errors.push("Respawned into unknown team.");
  }

  if (!Steam.isValidID3(b.player)) {
    // _errors.push("Invalid Steam ID(s).");
  } else {
    b.player = Steam.convertID3ToID64(b.player);
  }

  if (!_errors.length) {
    io.emit('respawn', b);
  }

  res.json(_errors);
});

app.post('/api/private/connected', function(req, res) {
  var b = req.body;
  var _errors = [];

  if (!Steam.isValidID3(b.player)) {
    // _errors.push("Invalid Steam ID(s).");
  } else {
    b.player = Steam.convertID3ToID64(b.player);
  }

  if (!_errors.length) {
    io.emit('connected', b);
  }

  res.json(_errors);
});

app.post('/api/private/disconnected', function(req, res) {
  var b = req.body;
  var _errors = [];

  if (!isValidTeam(b.team)) {
	   _errors.push("Disconnect from unknown team.");
  }

  if (!Steam.isValidID3(b.player)) {
    // _errors.push("Invalid Steam ID(s).");
  } else {
    b.player = Steam.convertID3ToID64(b.player);
  }

  if (!_errors.length) {
    io.emit('disconnected', b);
  }

  res.json(_errors);
});

app.post('/api/private/teamswitch', function(req, res) {
  var b = req.body;
  var _errors = [];

  if (!isValidTeam(b.team)) {
	   _errors.push("Teamswitch to unknown team.");
  }

  if (!Steam.isValidID3(b.player)) {
    // _errors.push("Invalid Steam ID(s).");
  } else {
    b.player = Steam.convertID3ToID64(b.player);
  }

  if (!_errors.length) {
    io.emit('teamswitch', b);
  }

  res.json(_errors);
});

app.post('/api/private/playerscores', function(req, res) {
  var b = req.body;
  var _errors = [];

  var _red_players = req.body.red_players;
  var _blu_players = req.body.blu_players;

  var tryConvertPlayerId = function(player) {
    if (!Steam.isValidID3(player.player)) {
      return;
    } else {
      player.player = Steam.convertID3ToID64(player.player);
    }
  }

  b.red_players.forEach(tryConvertPlayerId);
  b.blu_players.forEach(tryConvertPlayerId);

  if (!_errors.length) {
    io.emit('playerscores', b);
  }

  res.json(_errors);
});

app.post('/api/private/roundover', function(req, res) {
  var b = req.body;
  var _errors = [];

  if (b.red_score < 0) {
    _errors.push("Invalid RED score.");
  }

  if (b.blu_score < 0) {
    _errors.push("Invalid BLU score.");
  }

  if ([0, 1, 3].indexOf(b.winning_team) === -1) {
	   _errors.push("Invalid winning team.");
  }

  if (!_errors.length) {
    io.emit('roundover', b);
  }

  res.json(_errors);
});
