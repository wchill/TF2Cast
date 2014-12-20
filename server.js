var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var server = require('http').Server(app);
server.listen(8000);
var io = require('socket.io')(server);

app.use(bodyParser());

var xhr = require('./utils/xhr');
var Steam = require('./js/utils/steam');
var Constants = require('./js/constants/Constants');

var _messages = [{text: 'Welcome to the Team Fortress 2 Stream!', id: 0}];

/*
  Player Object => {
     player: string    // SteamID64 (or bot name in the case of a bot)
     team: int         // Team ID (Red, Blu, or Spectator)
     name: string      // Steam Persona Name
     score: int        // The player's in-game score
     avatar: string    // URL to the player's Steam avatar
     alive: boolean,   // Flag to signal a player is dead
     charClass: string // The name of their character's class in TF2
  }
*/
var _players = {};
var _teamScores = [0, 0, 0];

// Resets the message state
function resetMessages() {
  _messages = [
    {text: 'Welcome to the Team Fortress 2 Stream!', id: 0}
  ];
}

// Resets the scoreboard state
var resetScoreboard = function() {
  _players = {};
  _teamScores = [0, 0, 0];

  io.emit('scoreboard_reset', {});
};

// Validates a team ID
var isValidTeam = function(teamid) {
  if(typeof teamid == 'string' || teamid instanceof String) {
    if(teamid.length != 1) return false;
    teamid = parseInt(teamid);
  }
  return Constants.VALID_TEAM.indexOf(teamid) > -1;
};

// Checks whether a player id is in the format of a SteamID3 id, which would
// imply that it's not a bot
var isBot = function(playerid) {
  return !Steam.isValidID3(playerid);
};

// Convert SteamID3 to SteamID64
var convertPlayerId = function(player) {
  if (Steam.isValidID3(player.player)) {
    player.player = Steam.convertID3ToID64(player.player);
  }
};

// Create a default player object with sane defaults
// Note: The 'name' is TBD for real players (until the Steam API returns).
//       The 'charClass' is TBD until a respawn event is initiated
var createDefaultPlayer = function(player, teamid) {
  return {
    player: player.player,
    name: isBot(player) ? player.player : '',
    avatar: '',
    score: player.score || 0,
    team: teamid,
    alive: true,
    charClass: player.charClass || 'Unknown'
  };
};

// Given a player object from Steam, extract the persona name and avatar
var updatePlayerSteamData = function (player, steam) {
  var p = steam.response.players[0];
  _players[player].name = p.personaname;
  _players[player].avatar = p.avatar;
};

// Add each player to the associated team while making sure
// to retrieve the appropriate Steam information, etc.
var addPlayersToTeam = function(players, teamid) {
  if(typeof players == 'string' || players instanceof String) {
    players = JSON.parse(players); } players.forEach(function(player) {
    var playerID3 = player.player; // Steam ID in ID3 format (or bot name)

    convertPlayerId(player);
    _players[player.player] = createDefaultPlayer(player, teamid);

    if(isBot(playerID3)) {
      // Nothing to retrieve from Steam API
      io.emit('player_add', _players[player.player]);
    } else {
      var url = Steam.getPlayerSummaryURL(player.player);
      var userRequest = xhr('GET', url);

      userRequest.success(function(data) {
        updatePlayerSteamData(player.player, data);
        io.emit('player_add', _players[player.player]);
      });

      userRequest.error(function(data) {
        io.emit('player_add', _players[player.player]);
      });
    }

  });
};

var updateTeamScore = function(team, score) {
  if (_teamScores.hasOwnProperty(team)) {
    _teamScores[team] = score;

    io.emit('team_update', {
      team: team,
      score: _teamScores[team]
    });
  }
};

var _updatePlayerScoreHelper = function(player, score) {
  if (_players.hasOwnProperty(player)) {
    _players[player].score = score;
    io.emit('player_update', _players[player]);
  }
};

var updatePlayerScore = function(data) {
  if (data.player && data.score) {
    _updatePlayerScoreHelper(data.player, data.score);
  }
};

app.use('/', express.static(__dirname));

// Don't reset on new client connection
io.on('connection', function(socket) {
  socket.emit('messages_from_server', _messages);
  socket.emit('scoreboard_init', {players: _players, teamScores: _teamScores});
});

app.post('/api/private/bootstrap', function(req, res) {
  console.log('POST /api/private/bootstrap');

  var b = req.body;
  var _errors = [];

  if (!(b.red_players && b.blu_players && b.spectators)) {
    _errors.push("Invalid team (or spectator) list.")
  }

  var _red_wins = b.red_wins || -1;
  if (_red_wins < 0) {
	   _errors.push("Invalid number of RED wins.");
  }

  var _blu_wins = b.blu_wins || -1;
  if (_blu_wins < 0) {
	   _errors.push("Invalid number of BLU wins.");
  }

  if (!_errors.length) {
    resetMessages();
    resetScoreboard();

    updateTeamScore(Constants.RED, b.red_wins);
    updateTeamScore(Constants.BLU, b.blu_wins);

    addPlayersToTeam(b.red_players, Constants.RED);
    addPlayersToTeam(b.blu_players, Constants.BLU);
    addPlayersToTeam(b.spectators, Constants.SPEC);
  }

  res.json(_errors);
});

app.post('/api/private/death', function(req, res) {
  console.log('POST /api/private/death');

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


  if(Steam.isValidID3(b.victim)) b.victim = Steam.convertID3ToID64(b.victim);
  if(Steam.isValidID3(b.attacker)) b.attacker= Steam.convertID3ToID64(b.attacker);
  if(b.assister && Steam.isValidID3(b.assister)) b.assister = Steam.convertID3ToID64(b.assister);

  if(!_errors.length) {
    _players[b.victim].alive = false;
    io.emit('player_update', _players[b.victim]);

    // Used for death notifications
    io.emit('player_death', b);
  }

  res.json(_errors);
});

app.post('/api/private/respawn', function(req, res) {
  console.log('POST /api/private/respawn');
  console.log(req.body);

  var b = req.body;
  var _errors = [];

  if (!isValidTeam(b.team)) {
	   _errors.push("Respawned into unknown team.");
  }

  if (Steam.isValidID3(b.player)) {
    b.player = Steam.convertID3ToID64(b.player);
  }

  if (!_players.hasOwnProperty(b.player)) {
    _errors.push("Player doesn't exist.")
  }

  if (!_errors.length) {
    _players[b.player].alive = true;
    _players[b.player].charClass = b.charClass;
    console.log(_players[b.player])

    io.emit('player_update', _players[b.player]);
  }

  res.json(_errors);
});

app.post('/api/private/connected', function(req, res) {
  console.log('POST /api/private/connected');

  var b = req.body;
  var _errors = [];

  if (!_errors.length) {
    addPlayersToTeam([{player: b.player}], +b.team);
  }

  res.json(_errors);
});

app.post('/api/private/disconnected', function(req, res) {
  console.log('POST /api/private/disconnected');

  var b = req.body;
  var _errors = [];

  if (!isValidTeam(b.team)) {
	   _errors.push("Disconnect from unknown team.");
  }

  if (Steam.isValidID3(b.player)) {
    b.player = Steam.convertID3ToID64(b.player);
  }

  if (!_players.hasOwnProperty(b.player)) {
    _errors.push("Player doesn't exist.")
  }

  if (!_errors.length) {
    io.emit('player_delete', _players[b.player]);
    delete _players[b.player];
  }

  res.json(_errors);
});

app.post('/api/private/teamswitch', function(req, res) {
  console.log('POST /api/private/teamswitch');

  var b = req.body;
  var _errors = [];

  if (!isValidTeam(b.team)) {
	   _errors.push("Teamswitch to unknown team.");
  }

  if (Steam.isValidID3(b.player)) {
    b.player = Steam.convertID3ToID64(b.player);
  }

  if (!_players.hasOwnProperty(b.player)) {
    _errors.push("Player doesn't exist.")
  }

  if (!_errors.length) {
    _players[b.player].team = +b.team;
    io.emit('player_update', _players[b.player]);
  }

  res.json(_errors);
});

app.post('/api/private/playerscores', function(req, res) {
  console.log('POST /api/private/playerscores');

  var b = req.body;
  var _errors = [];

  if(typeof b.red_players == 'string' || b.red_players instanceof String) {
    b.red_players = JSON.parse(b.red_players);
    b.blu_players = JSON.parse(b.blu_players);
  }

  b.red_players.forEach(convertPlayerId);
  b.red_players.forEach(updatePlayerScore);

  b.blu_players.forEach(convertPlayerId);
  b.blu_players.forEach(updatePlayerScore);

  res.json(_errors);
});

app.post('/api/private/roundover', function(req, res) {
  console.log('POST /api/private/roundover');

  var b = req.body;
  var _errors = [];

  var _red_score = b.red_score || -1;
  if (_red_score < 0) {
    _errors.push("Invalid RED score.");
  }

  var _blu_score = b.blu_score || -1;
  if (_blu_score < 0) {
    _errors.push("Invalid BLU score.");
  }

  if (Constants.VALID_WINNING_TEAM.indexOf(+b.winning_team) === -1) {
	   _errors.push("Invalid winning team.");
  }

  if (!_errors.length) {
    updateTeamScore(Constants.RED, b.red_score);
    updateTeamScore(Constants.BLU, b.blu_score);
    io.emit('message_from_server', {text: 'Round over', id: 398});
  }

  res.json(_errors);
});
