var EventEmitter = require('events').EventEmitter;
var AppDispatcher = require('../dispatcher/AppDispatcher');
var Constants = require('../constants/Constants');

var assign = require('react/lib/Object.assign');
var socketHandler = require('../socketHandler');

// Team: {
//   id: int
//   players: Array<player>
//   score: int
// }
var teams = [];

// Player: {
//   id: string
//   team: int // ???
//   name: string
//   score: int
//   etc.
// }

var RED_ID = 0;
var RED = {id: RED_ID, players: [], score: 0};

var BLU_ID = 1;
var BLU = {id: BLU_ID, players: [], score: 0};

var SPEC_ID = 2;
var SPECTATORS = {id: SPEC_ID, players: [], score: 0};

function reset() {
  teams = [RED, BLU];
}

function isValidTeam(teamId) {
  return RED_ID <= teamId && teamId <= SPEC_ID;
}

function addTeam(teamId, team) {
  if (isValidTeam(teamId)) {
    teams[teamId] = team;
  }
}

function fetchTeam(teamId) {
  if (isValidTeam(teamId)) {
    return teams[teamId];
  }

  return null;
}

function addPlayer(teamId, player) {
  var existingPlayer = fetchPlayer(player.id);
  if (existingPlayer !== null) {
    updatePlayer()
  }

  teams[teamId].push(player);
  teams[teamId].sort
}

// TODO Find a better way?
function removePlayer(playerId) {
  teams.forEach(function(team) {
    team.players = team.players.filter(function(player) {
      if (player.id !== playerId) {
        return player;
      }
    });
  });
}

function updatePlayer(playerId, playerDelta) {
  var player = fetchPlayer(playerId);
  if (player === null) {
    return;
  }

  for (var key in playerDelta) {
    if (playerDelta.hasOwnProperty(key) &&
      player.hasOwnProperty(key)) {
        player[key] = playerDelta[key];
      }
    }
  }

function fetchPlayer(playerId) {
  teams.forEach(function(team) {
    var player = fetchPlayerFromTeam(team.id, playerId);
    if (player !== null) {
      return player;
    }
  });

  return null;
}

function fetchPlayerFromTeam(teamId, playerId) {
  var team = fetchTeam(teamId);
  if (team === null) {
    return null;
  }

  team.players.forEach(function(player) {
    if (player.id === playerId) {
      return player;
    }
  });

  return null;
}

var TeamStore = assign({}, EventEmitter.prototype, {

  getTeams: function() {
    return teams;
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

  switch(action.type) {
    case Constants.DEATH:
      addMessage(action.payload);
      MessageStore.emitChange();
      break;

    case Constants.RESET:
      reset();
      MessageStore.emitChange();
      break;
  }

  return true;
});

module.exports = TeamStore;
