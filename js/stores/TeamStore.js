var EventEmitter = require('events').EventEmitter;
var AppDispatcher = require('../dispatcher/AppDispatcher');
var assign = require('react/lib/Object.assign');
var Constants = require('../constants/Constants');
var socketHandler = require('../socketHandler');
var xhr = require('../utils/xhr');

var _BOT_RE = /^([\d]+)$/;

// Team: {
//   id: int
//   players: map <playerid, player>
//   score: int
// }

// Player: {
//   player: string
//   team: int // ???
//   name: string
//   score: int
//   avatar: string // URL
//   dead: boolean,
//   charClass: ""
// }
var _RED = Constants.RED;
var _BLU = Constants.BLU;
var _SPEC = Constants.SPEC;

var _players = {};
var _teamScores = [0, 0, 0]; // [RED, BLU, SPEC]

function reset() {
  _players = {};
  _teamScores = [0, 0, 0];
}

function isBot(playerid) {
  return !(_BOT_RE.test(playerid) && playerid.length > 12);
}

function playersToArray() {
  var a = [];

  for (p in _players) {
    if (_players.hasOwnProperty(p)) {
      a.push(_players[p]);
    }
  }

  return a;
}

function getTeam(teamid) {
  var a = playersToArray();
  var teamPlayers = a.filter( function (p) {return p.team === teamid;} );

  return {
    id: teamid,
    players: teamPlayers,
    score: _teamScores[teamid]
  }
}

function addPlayersToTeam(players, teamid) {
  console.log(players);
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

    console.log(player.player)
    if(!isBot(player.player)) {
      socketHandler.getPlayerSummary(player.player);
    }

  });
}

var TeamStore = assign({}, EventEmitter.prototype, {

  getTeams: function() {
    return [getTeam(_RED), getTeam(_BLU)];
  },

  getPlayerName: function(playerid) {
    if(!isBot(playerid)) {
      return _players[playerid].name;
    } else {
      return playerid;
    }
  },

  getSpectators: function() {
    return getTeam(_SPEC);
  },

  emitChange: function() {
    this.emit(Constants.CHANGE_EVENT);
  },

  addChangeListener: function(callback) {
    this.on(Constants.CHANGE_EVENT, callback);
  },

  removeChangeListener: function(callback) {
    this.removeListener(Constants.CHANGE_EVENT, callback);
  }
});

AppDispatcher.register(function(payload) {
  var action = payload.action;
  var type = action.type;
  var message = action.message; // Message from plugin

  switch(type) {
    case Constants.RESET:
      console.log('RESET');
      reset();
      TeamStore.emitChange();
      break;

    case Constants.BOOTSTRAP:
      console.log('BOOTSTRAP');
      //reset(); // Bootstrap should only be called at the start of a game
      if (message.hasOwnProperty('red_wins')
        && message.hasOwnProperty('blu_wins')
        && message.hasOwnProperty('red_players')
        && message.hasOwnProperty('blu_players')) {

        _teamScores[_RED] = message.red_wins;
        _teamScores[_BLU] = message.blu_wins;
        addPlayersToTeam(message.red_players, _RED);
        addPlayersToTeam(message.blu_players, _BLU);
        addPlayersToTeam(message.spectators, _SPEC);

        TeamStore.emitChange();
      } else {
        console.log("Malformed bootstrap event");
      }
      break;

    case Constants.DEATH:
      console.log('DEATH');
      if (message.hasOwnProperty('victim')) {
        _players[message.victim].alive = false;
        TeamStore.emitChange();
      } else {
        console.log("Malformed death event");
      }
      break;

    case Constants.RESPAWN:
      console.log('RESPAWN');
      if (message.hasOwnProperty('player')) {
        _players[message.player].alive = true;
        _players[message.player].charClass = message.charClass;
        TeamStore.emitChange();
      } else {
        console.log("Malformed respawn event");
      }
      break;

    case Constants.CONNECTED:
      console.log('CONNECTED');
      if (message.hasOwnProperty('player') && message.hasOwnProperty('team')) {
        addPlayersToTeam([{player: message.player}], message.team);
        TeamStore.emitChange();
      } else {
        console.log("Malformed connected event");
      }
      break;

    case Constants.DISCONNECTED:
      console.log('DISCONNECTED');
      if (message.hasOwnProperty('player')) {
        delete _players[message.player];
        TeamStore.emitChange();
      } else {
        console.log("Malformed disconnected event");
      }
      break;

    case Constants.TEAM_SWITCH:
      console.log('TEAM SWITCH');
      if (message.hasOwnProperty('player') && message.hasOwnProperty('team')) {
        _players[message.player].team = message.team;
        TeamStore.emitChange();
      } else {
        console.log("Malformed teamswitch event");
      }
      break;

    case Constants.PLAYER_SCORES:
      console.log('PLAYER SCORES');
      if (message.hasOwnProperty('red_players') && message.hasOwnProperty('blu_players')) {
        message.red_players.forEach(function(red_player) {
          if (red_player.hasOwnProperty('player')
            && red_player.hasOwnProperty('score')
            && _players.hasOwnProperty(red_player.player)) {
            _players[red_player.player].score = red_player.score;
          }
        });

        message.blu_players.forEach(function(blu_player) {
          if (blu_player.hasOwnProperty('player')
            && blu_player.hasOwnProperty('score')
            && _players.hasOwnProperty(blu_player.player)) {
            _players[blu_player.player].score = blu_player.score;
          }
        });

        TeamStore.emitChange();
      } else {
        console.log("Malformed playersscores event");
      }

      break;

    case Constants.ROUND_OVER:
      console.log('ROUND OVER');
      if (message.hasOwnProperty('winning_team')
        && message.hasOwnProperty('red_score')
        && message.hasOwnProperty('blu_score')) {

        _teamScores[_RED] = message.red_score;
        _teamScores[_BLU] = message.blu_score;
        TeamStore.emitChange();
      } else {
        console.log("Malformed roundover event");
        console.log(message);
      }
      break;

    case Constants.PLAYER_SUMMARY:
      console.log('PLAYER SUMMARY');
      _players[message.player].name = message.name;
      _players[message.player].avatar = message.avatar;
      TeamStore.emitChange();
      break;

    case Constants.TF2_INIT:
      console.log('TF2_INIT');
      _players = message.players;

      var playersArray = playersToArray(message.players);
      playersArray.forEach(function(p) {
        addPlayersToTeam([p], p.team);
      });

      _teamScores = message.teamScores;
      TeamStore.emitChange();
      break;

    default:
      console.log('Undefined action received.');
      console.log(action);
  }
});

module.exports = TeamStore;
