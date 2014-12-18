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

var _messages = [];

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
});

app.post('/api/private/bootstrap', function(req, res) {
  var _errors = [];
  var _map_time = req.body.map_time;
  var _red_wins = req.body.red_wins;
  var _blu_wins = req.body.blu_wins;
  var _red_players = req.body.red_players;
  var _blu_players = req.body.blu_players;
  var _spectators = req.body.spectators;

  if (_map_time < -1) {
	_errors.push("Invalid map time.");
  }

  if (_red_wins < 0) {
	_errors.push("Invalid number of RED wins.");
  }

  if (_blu_wins < 0) {
	_errors.push("Invalid number of BLU wins.");
  }

  res.json(_errors);
});

app.post('/api/private/death', function(req, res) {
  var _errors = [];
  var _victim = req.body.victim;
  var _attacker = req.body.attacker;
  var _assister = req.body.assister;
  var _weapon = req.body.weapon;
  var _death_type = req.body.death_type;
  var _victim_team = req.body.victim_team;
  var _attacker_team = req.body.attacker_team;
  var _assister_team = req.body.assister_team;

  if (_victim_team < 0 || _victim_team > 2) {
	_errors.push("Victim belongs to unknown team.");
  }

  if (_attacker_team < 0 || _attacker_team > 2) {
	_errors.push("Attacker belongs to unknown team.");
  }

  if (_assister_team < 0 || _assister_team > 2) {
	_errors.push("Assister belongs to unknown team.");
  }

  if(!_errors.length)
    io.emit('death', req.body);
  res.json(_errors);
});

app.post('/api/private/respawn', function(req, res) {
  var _errors = [];

  var _player = req.body.player;
  var _team = req.body.team;
  var _class = req.body['class'];

  if (_team < 0 || _team > 2) {
	_errors.push("Respawned into unknown team.");
  }

  if (!_errors.length)
    io.emit('respawn', req.body);

  res.json(_errors);
});

app.post('/api/private/connected', function(req, res) {
  var _errors = [];

  io.emit('connected', req.body);

  res.json(_errors);
});

app.post('/api/private/disconnected', function(req, res) {
  var _errors = [];

  var _player = req.body.player;
  var _team = req.body.team;

  if (_team < -1 || _team > 2) {
	_errors.push("Disconnect from unknown team.");
  }

  if (!_errors.length)
    io.emit('disconnected', req.body);

  res.json(_errors);
});

app.post('/api/private/teamswitch', function(req, res) {
  var _errors = [];

  var _player = req.body.player;
  var _team = req.body.team;

  if (_team < 0 || _team > 2) {
	_errors.push("Teamswitch to unknown team.");
  }

  if (!_errors.length)
    io.emit('teamswitch', req.body);

  res.json(_errors);
});

app.post('/api/private/playerscores', function(req, res) {
  var _errors = [];

  var _red_players = req.body.red_players;
  var _blu_players = req.body.blu_players;

  for (var i = 0; i < _red_players.length; i++) {
	if (!_red_players[i].hasOwnProperty("playerid")) {
		_errors.push("Player ID not found");
	}
	if (!_red_players[i].hasOwnProperty("score")) {
		_errors.push("Player Score not found");
	} else if (_red_players[i].score < 0) {
		_errors.push("Invalid score.");
	}
  }

  for (var i = 0; i < _blu_players.length; i++) {
	if (!_blu_players[i].hasOwnProperty("playerid")) {
		_errors.push("Player ID not found");
	}
	if (!_blu_players[i].hasOwnProperty("score")) {
		_errors.push("Player Score not found");
	} else if (_blu_players[i].score < 0) {
		_errors.push("Invalid score.");
	}
  }

  if (!_errors.length)
    io.emit('playerscores', req.body);

  res.json(_errors);
});

app.post('/api/private/roundover', function(req, res) {
  var _errors = [];

  var _winning_team = req.body.winning_team;
  var _red_score = req.body.red_score;
  var _blu_score = req.body.blu_score;

  if (_winning_team != 0 && _winning_team != 1 && _winning_team != 3) {
	_errors.post("Winning team undefined.");
  }

  if (!_errors.length)
    io.emit('roundover', req.body);

  res.json(_errors);
});
