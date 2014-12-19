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
var _players = {};
var _teamScores = [0, 0, 0];

function isValidTeam(teamid) {
  return [Constants.RED, Constants.BLU, Constants.SPEC].indexOf(teamid) > -1;
}

function resetMessages() {
  _messages = [
    {text: 'Welcome to team fortress 2 Stream!', id: 0}
  ];
}

function resetTeams() {
  _players = {};
  _teamScores = [0, 0, 0];
}

function isBot(playerid) {
  return !Steam.isValidID3(playerid);
}

function createMessage(text) {
  var newMessage = {text: text, id: _messages.length};
  _messages.push(newMessage);
  return newMessage;
}

var tryConvertPlayerId = function(player) {
  if (Steam.isValidID3(player.player)) {
    player.player = Steam.convertID3ToID64(player.player);
  }
};

function addPlayersToTeam(players, teamid) {
  players.forEach(function(player) {
    _players[player.player] = {
      player: player.player,
      name: isBot(player) ? player.player : '',
      avatar: '',
      score: player.score || 0,
      team: teamid,
      alive: true,
      charClass: player.charClass || ''
    };

    if(!isBot(player.player)) {
      var url = Steam.getPlayerSummaryURL(player);
      var userRequest = xhr('GET', url);

      userRequest.success(function(data) {
        var _player = data.response.players[0];
        _players[player.player].name = _player.personaname;
        _players[player.player].avatar = _player.avatar;
      });
      userRequest.error(function(data) {
        _players[player.player].name = '';
        _players[player.player].avatar = '';
      });
    }

  });
}



app.use('/', express.static(__dirname));

io.on('connection', function(socket) {
  socket.emit('messages_from_server', _messages);
  socket.emit('tf2_init', {players: _players, teamScores: _teamScores});

  // TODO This can be removed probably
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

  b.red_players.forEach(tryConvertPlayerId);
  b.blu_players.forEach(tryConvertPlayerId);
  b.spectators.forEach(tryConvertPlayerId);

  if (!_errors.length) {
    console.log('BOOTSTRAP');
    _teamScores[Constants.RED] = b.red_wins;
    _teamScores[Constants.BLU] = b.blu_wins;
    addPlayersToTeam(b.red_players, Constants.RED);
    addPlayersToTeam(b.blu_players, Constants.BLU);
    addPlayersToTeam(b.spectators, Constants.SPEC);

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

  if (Steam.areValidID3s([b.victim, b.attacker, b.assister])) {
    b.victim = Steam.convertID3ToID64(b.victim);
    b.attacker = Steam.convertID3ToID64(b.attacker);

    if(b.assister) {
      b.assister = Steam.convertID3ToID64(b.assister);
    }
  }

  if(!_errors.length) {
    console.log('DEATH');
    _players[b.victim].alive = false;
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

  if (Steam.isValidID3(b.player)) {
    b.player = Steam.convertID3ToID64(b.player);
  }

  if (!_errors.length) {
    console.log('RESPAWN');
    _players[b.player].alive = true;
    _players[b.player].charClass = b.charClass;
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
    console.log('CONNECTED');
    addPlayersToTeam([{player: b.player}], b.team);
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
    console.log('DISCONNECTED');
    delete _players[b.player];
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
    console.log('TEAM SWITCH');
    _players[b.player].team = b.team;
    io.emit('teamswitch', b);
  }

  res.json(_errors);
});

app.post('/api/private/playerscores', function(req, res) {
  var b = req.body;
  var _errors = [];

  b.red_players.forEach(tryConvertPlayerId);
  b.blu_players.forEach(tryConvertPlayerId);

  if (!_errors.length) {
    console.log('PLAYER SCORES');
    b.red_players.forEach(function(red_player) {
      console.log("red_player");
      console.log(red_player);
      console.log("players");
      console.log(_players);
      if (red_player.hasOwnProperty('player')
        && red_player.hasOwnProperty('score')
        && _players.hasOwnProperty(red_player.player)) {

        _players[red_player.player].score = red_player.score;
      }
    });

    b.blu_players.forEach(function(blu_player) {
      if (blu_player.hasOwnProperty('player')
        && blu_player.hasOwnProperty('score')
        && _players.hasOwnProperty(blu_player.player)) {
        _players[blu_player.player].score = blu_player.score;
      }
    });
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
    console.log('ROUND OVER');
    _teamScores[Constants.RED] = b.red_score;
    _teamScores[Constants.BLU] = b.blu_score;
    io.emit('roundover', b);
  }

  res.json(_errors);
});
