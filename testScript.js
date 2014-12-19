// var Constants = require('./js/constants/Constants');

function parseIfJSON(data) {
  try {
    return JSON.parse(data);
  } catch (e) {
    return data;
  }
}

function xhr(type, url, data) {
  var callbacks = {
    success: [],
    error: []
  };

  var request = XMLHttpRequest ?
    new XMLHttpRequest() :
    new ActiveXObject('MSXML2.XMLHTTP.3.0');

  request.open(type, url, true);
  request.setRequestHeader(
    'Content-type',
    'application/json'
  );

  request.onreadystatechange = function() {
    if (request.readyState === 4) {
      var invokeCallback = function(callback) {
        callback.call(undefined, parseIfJSON(request.responseText), request);
      };

      if (request.status > 99 && request.status < 400) {
        callbacks.success.forEach(invokeCallback);
      } else {
        callbacks.error.forEach(invokeCallback);
      }
    }
  };

  request.send(data);

  return {
    success: function(callback) {
      callbacks.success.push(callback);
    },
    error: function(callback) {
      callbacks.error.push(callback);
    }
  }
}

var base_url = "http://localhost:8000"

var TEAMS = [
  {
    "name": "BLU",
    "score": 8,
    "members": [
      { "name": "Jumping up an down", "charClass": "Demoman", "avatar": "A", "score": 160, "alive": true },
      { "name": "santa", "charClass": "Demoman", "avatar": "", "score": 110, "alive": true },
      { "name": "IzuKel", "charClass": "Soldier", "avatar": "C", "score": 109, "alive": true },
      { "name": "muiranimuL", "charClass": "Pyro", "avatar": "D", "score": 102, "alive": true },
      { "name": "Sitzkreig", "charClass": "Spy", "avatar": "E", "score": 99, "alive": true },
      { "name": "Froze", "charClass": "Medic", "avatar": "F", "score": 72, "alive": true },
      { "name": "dean", "charClass": "Heavy", "avatar": "G", "score": 43, "alive": true },
      { "name": "FIR", "charClass": "Scout", "avatar": "H", "score": 2, "alive": false },
      { "name": "TemaZ", "charClass": "Soldier", "avatar": "I", "score": 2, "alive": false },
      { "name": "still alive", "charClass": "Engineer", "avatar": "", "score": 2, "alive": true },
      { "name": "Don-Don", "charClass": "Soldier", "avatar": "", "score": 1, "alive": true }
    ]
  },

  {
    "name": "RED",
    "score": 6,
    "members": [
      { "name": "Danightmare", "charClass": "Demoman", "avatar": "A", "score": 129, "alive": false },
      { "name": "Mitsuomi", "charClass": "Demoman", "avatar": "B", "score": 88, "alive": true },
      { "name": "Silver Sand", "charClass": "Soldier", "avatar": "C", "score": 86, "alive": false },
      { "name": "DeaTH", "charClass": "Pyro", "avatar": "D", "score": 50, "alive": false },
      { "name": "the Sentry of Duality", "charClass": "Spy", "avatar": "", "score": "44", "alive": true },
      { "name": "Zhao Yun", "charClass": "Medic", "avatar": "F", "score": 10, "alive": true },
      { "name": "InSidiousGG", "charClass": "Heavy", "avatar": "G", "score": 7, "alive": true },
      { "name": "dKiWi", "charClass": "Scout", "avatar": "H", "score": "0", "alive": true },
      { "name": "Pikachu", "charClass": "Soldier", "avatar": "", "score": 0, "alive": true },
      { "name": "frontier", "charClass": "Engineer", "avatar": "", "score": 0, "alive": true }
    ]
  }
];

// change names to '[U:1:XXXXXX]'

// range from 799 to 804 for middle should be valud
var left = '[U:1:169';
var right = ']';

  // { player:Danightmare, id:799 },
  // { player:Mitsuomi + right, id:800 },
  // { player:DeaTH, id:801 }

  // { player:santa, id:802 },
  // { player:IzuKel, id:803 },
  // { player:muiranimuL, id:804 }


var RED = 0;//Constants.RED;
var BLUE = 1;//Constants.BLU;

function bootstrap() {
    var data = {
            red_wins: 7,
            blu_wins: 3,
            red_players: [
              { player:left + '799' + right, score:0 },
              { player:left + '800' + right, score:0 },
              { player:left + '801' + right, score:0 }
            ],
            blu_players: [
              { player:left + '802' + right, score:0 },
              { player:left + '803' + right, score:0 },
              { player:left + '804' + right, score:0 }
            ],
            spectators: [
              { player:left + '798' + right, score:0 },
              { player: 'JoseBot', score:0 }
            ]
            // spectators: []
        };
    xhr('POST', base_url + '/api/private/bootstrap', JSON.stringify(data));

}

function roundOver() {
    var data = {
            red_score: 10,
            blue_score: 2,
            winning_team: 0
        }
    xhr('POST', base_url + '/api/private/roundover', JSON.stringify(data));
}

function kill1() {
    var data = {
            attacker: left + '799' + right,
            victim: left + '802' + right,
            assister: '',
            weapon: 'gun',
            death_type: 'shot',
            victim_team: BLUE,
            attacker_team: RED,
            spectator_team: 2
        };
    xhr('POST', base_url + '/api/private/death', JSON.stringify(data));
}

function kill2() {
    var data = {
            attacker: left + '803' + right,
            victim: left + '800' + right,
            assister: '',
            weapon: 'knife',
            death_type: 'knifed',
            victim_team: RED,
            attacker_team: BLUE,
            spectator_team: 2
        };
    xhr('POST', base_url + '/api/private/death', JSON.stringify(data));
}

function connect1() {
    var data = {
            player: left + '799' + right,
            team: RED
        };
    xhr('POST', base_url + '/api/private/connected', JSON.stringify(data));
}

function connect2() {
    var data = {
            player: left + '800' + right,
            team: RED
        };
    xhr('POST', base_url + '/api/private/connected', JSON.stringify(data));
}

function connect3() {
    var data = {
            player: left + '801' + right,
            team: RED
        };
    xhr('POST', base_url + '/api/private/connected', JSON.stringify(data));
}

function connect4() {
    var data = {
            player: left + '802' + right,
            team: BLUE
        };
    xhr('POST', base_url + '/api/private/connected', JSON.stringify(data));
}

function connect5() {
    var data = {
            player: left + '803' + right,
            team: BLUE
        };
    xhr('POST', base_url + '/api/private/connected', JSON.stringify(data));
}

function connect6() {
    var data = {
            player: left + '804' + right,
            team: BLUE
        };
    xhr('POST', base_url + '/api/private/connected', JSON.stringify(data));
}

function disconnect1() {
    var data = {
            player: left + '799' + right,
            team: RED
        };
    xhr('POST', base_url + '/api/private/disconnected', JSON.stringify(data));
}

function disconnect2() {
    var data = {
            player: left + '800' + right,
            team: RED
        };
    xhr('POST', base_url + '/api/private/disconnected', JSON.stringify(data));
}

function disconnect3() {
    var data = {
            player: left + '801' + right,
            team: RED
        };
    xhr('POST', base_url + '/api/private/disconnected', JSON.stringify(data));
}

function disconnect4() {
    var data = {
            player: left + '802' + right,
            team: BLUE
        };
    xhr('POST', base_url + '/api/private/disconnected', JSON.stringify(data));
}

function disconnect5() {
    var data = {
            player: left + '803' + right,
            team: BLUE
        };
    xhr('POST', base_url + '/api/private/disconnected', JSON.stringify(data));
}

function disconnect6() {
    var data = {
            player: left + '804' + right,
            team: BLUE
        };
    xhr('POST', base_url + '/api/private/disconnected', JSON.stringify(data));
}

function teamSwitch1() {
    var data = {
            player: left + '799' + right,
            team: 0
        };
    xhr('POST', base_url + '/api/private/teamswitch', JSON.stringify(data));
}

function teamSwitch2() {
    var data = {
            player: left + '799' + right,
            team: 1
        };
    xhr('POST', base_url + '/api/private/teamswitch', JSON.stringify(data));
}

function respawn1() {
    var data = {
            player: left + '802' + right,
            class: 'gifter',
            team: RED
        };
    xhr('POST', base_url + '/api/private/respawn', JSON.stringify(data));
}

function respawn2() {
    var data = {
            player: left + '800' + right,
            class: 'elf',
            team: BLUE
        };
    xhr('POST', base_url + '/api/private/respawn', JSON.stringify(data));
}

function playerScores() {
    var data = {
            red_players: [
              { player:left + '799' + right, score:4 },
              { player:left + '800' + right, score:5 },
              { player:left + '801' + right, score:6 }
            ],
            blu_players: [
              { player:left + '802' + right, score:7 },
              { player:left + '803' + right, score:8 },
              { player:left + '804' + right, score:9 }
            ]
        };
    xhr('POST', base_url + '/api/private/playerscores', JSON.stringify(data));
}