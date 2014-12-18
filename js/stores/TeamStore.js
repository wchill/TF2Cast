var EventEmitter = require('events').EventEmitter;
var AppDispatcher = require('../dispatcher/AppDispatcher');
var Constants = require('../constants/Constants');
var assign = require('react/lib/Object.assign');
var socketHandler = require('../socketHandler');


// Team: {
//   id: int
//   players: map <playerid, player>
//   score: int
// }

// Player: {
//   id: string
//   team: int // ???
//   name: string
//   score: int
//   avatar: string // URL
//   dead: boolean
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
  return playerid[0] !== '[';
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
  _players[player.playerid] = {
    id: player.playerid,
    name: isBot(player) ? player.playerid : '',
    avatar: '',
    score: player.score,
    team: teamid,
    alive: true
  };

  // Not sure if we'll need to do this in a closure or not...
  if (!isBot(player)) {
    var url = Steam.getPlayerSummaryURL(player.playerid);
    var userRequest = xhr('GET', url);
    userRequest.success(function(data) {
      _players[player.playerid].name = data.playername;
      _players[player.playerid].avatar = data.avatar; // url to 32 x 32px
    });
    userRequest.error(function(data) {
      _players[player.playerid].name = player.playerid;
      // TODO Add default avatar in local assets folder
    });
  }
}

var TeamStore = assign({}, EventEmitter.prototype, {

  getTeams: function() {
    return [getTeam(_RED), getTeam(_BLU)];
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

  console.log(action);

  switch(type) {
    case Constants.RESET:
      console.log('RESET');
      reset();
      TeamStore.emitChange();
      break;

    case Constants.BOOTSTRAP:
      console.log('BOOTSTRAP');
      reset(); // Bootstrap should only be called at the start of a game

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
        TeamStore.emitChange();
      } else {
        console.log("Malformed respawn event");
      }
      break;

    case Constants.CONNECTED:
      console.log('CONNECTED');
      if (message.hasOwnProperty('player') && message.hasOwnProperty('team')) {
        addPlayersToTeam([message.player], message.team);
        TeamStore.emitChange();
      } else {
        console.log("Malformed connected event");
      }
      break;

    case Constants.DISCONNECTED:
      console.log('DISCONNECTED');

      // TODO Is this desired?
      if (message.hasOwnPropery('player')) {
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

    case Constants.PLAYERS_SCORES:
      console.log('PLAYER SCORES');

      if (message.hasOwnProperty('red_players') && message.hasOwnProperty('blu_players')) {
        message.red_players.forEach(function(red_player) {
          if (red_player.hasOwnProperty('player') && red_player.hasOwnProperty('score')) {
            _players[red_player.player].score = red_player.score;
          }
        });

        message.blu_players.forEach(function(blu_player) {
          if (blu_player.hasOwnPropert('player') && blu_player.hasOwnProperty('score')) {
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
      }
      break;

    default:
      console.log('Undefined action received.');
      console.log(action);
  }
});

module.exports = TeamStore;
