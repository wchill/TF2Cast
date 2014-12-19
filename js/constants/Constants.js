var keyMirror = require('react/lib/keyMirror');

module.exports = keyMirror({
  CHANGE_EVENT: null,
  RESET: null,
  PLAYER_ADD: null,
  PLAYER_DELETE: null,
  PLAYER_UPDATE: null,
  PLAYER_DEATH: null,
  TEAM_UPDATE: null,
  SCOREBOARD_INIT: null,
  SCOREBOARD_RESET: null,
  MESSAGE_RECEIVE: null
});

module.exports.RED = 0;
module.exports.BLU = 1;
module.exports.SPEC = 2;
module.exports.TIE = 3;
module.exports.VALID_TEAM = [module.exports.RED, module.exports.BLU, module.exports.SPEC];
module.exports.VALID_WINNING_TEAM = [module.exports.RED, module.exports.BLU, module.exports.TIE];
