var EventEmitter = require('events').EventEmitter;
var AppDispatcher = require('../dispatcher/AppDispatcher');
var assign = require('react/lib/Object.assign');
var Constants = require('../constants/Constants');


var _BOT_RE = /^([\d]+)$/; // Verify steamID64 format

var _players = {};
var _teamScores = [0, 0, 0]; // [RED, BLU, SPEC]

function reset() {
  _players = {};
  _teamScores = [0, 0, 0];
}

function isBot(playerid) {
  return !(_BOT_RE.test(playerid) && playerid.length > 12);
}

// Take an object and return an array containing the values in that object.
function playersToArray() {
  var a = [];

  for (p in _players) {
    if (_players.hasOwnProperty(p)) {
      a.push(_players[p]);
    }
  }

  return a;
}

// Create team array on demand to allow easier player management
function getTeam(teamid) {
  var a = playersToArray();
  var teamPlayers = a.filter( function (p) {return p.team === teamid;} );

  return {
    id: teamid,
    players: teamPlayers,
    score: _teamScores[teamid]
  }
}

var TeamStore = assign({}, EventEmitter.prototype, {

  getTeams: function() {
    return [getTeam(Constants.RED), getTeam(Constants.BLU)];
  },

  getSpectators: function() {
    return getTeam(Constants.SPEC);
  },

  getPlayerName: function(playerid) {
    if(!isBot(playerid)) {
      return _players[playerid].name;
    } else {
      return playerid;
    }
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
  var message = action.message;

  switch(type) {
    case Constants.RESET:
      console.log('TEAM STORE: Reset');
      //reset();

      //TeamStore.emitChange();
      break;

    case Constants.PLAYER_ADD:
      console.log('TEAM STORE: Player Add');

      _players[message.player] = message;

      TeamStore.emitChange();
      break;

    case Constants.PLAYER_DELETE:
      console.log('TEAM STORE: Player Delete');

      delete _players[message.player];

      TeamStore.emitChange();
      break;

    case Constants.PLAYER_UPDATE:
      console.log('TEAM STORE: Player Update');

      _players[message.player] = message;

      TeamStore.emitChange();
      break;

    case Constants.TEAM_UPDATE:
      console.log('TEAM STORE: Team Update');
      var team = message.team;
      var score = message.score;

      _teamScores[team] = score;

      TeamStore.emitChange();
      break;

    case Constants.SCOREBOARD_INIT:
      console.log('TEAM STORE: Scoreboard Init');

      _players = message.players;
      _teamScores = message.teamScores;

      TeamStore.emitChange();
      break;

    case Constants.SCOREBOARD_RESET:
      console.log('TEAM STORE: Scoreboard Reset');
      reset();

      TeamStore.emitChange();
      break;
  }
});

module.exports = TeamStore;
