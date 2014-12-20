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


// change names to '[U:1:XXXXXX]'
// range from 799 to 804 for middle should be valud
var left = '[U:1:169';
var right = ']';
var RED = 0;
var BLUE = 1;

function bootstrap() {
    var data = {
            red_wins: 7,
            blu_wins: 3,
            red_players: [
              { player:left + '799' + right, score:0, charClass: "Engineer" },
              { player:left + '800' + right, score:0, charClass: "Heavy" },
              { player:left + '801' + right, score:0, charClass: "Medic" }
            ],
            blu_players: [
              { player:left + '802' + right, score:0, charClass: "Soldier" },
              { player:left + '803' + right, score:0, charClass: "Spy" },
              { player:left + '804' + right, score:0, charClass: "Medic" }
            ],
            spectators: [
              { player:left + '798' + right, score:0, charClass: "Heavy" },
            ]
        };
    xhr('POST', base_url + '/api/private/bootstrap', JSON.stringify(data));

}

function roundOver() {
    var data = {
            red_score: 10,
            blu_score: 2,
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
            team: RED,
            charClass: "Engineer"
        };
    xhr('POST', base_url + '/api/private/connected', JSON.stringify(data));
}

function connect2() {
    var data = {
            player: left + '800' + right,
            team: RED,
            charClass: "Heavy"
        };
    xhr('POST', base_url + '/api/private/connected', JSON.stringify(data));
}

function connect3() {
    var data = {
            player: left + '801' + right,
            team: RED,
            charClass: "Medic"
        };
    xhr('POST', base_url + '/api/private/connected', JSON.stringify(data));
}

function connect4() {
    var data = {
            player: left + '802' + right,
            team: BLUE,
            charClass: "Soldier"
        };
    xhr('POST', base_url + '/api/private/connected', JSON.stringify(data));
}

function connect5() {
    var data = {
            player: left + '803' + right,
            team: BLUE,
            charClass: "Spy"
        };
    xhr('POST', base_url + '/api/private/connected', JSON.stringify(data));
}

function connect6() {
    var data = {
            player: left + '804' + right,
            team: BLUE,
            charClass: "Medic"
        };
    xhr('POST', base_url + '/api/private/connected', JSON.stringify(data));
}

function disconnect1() {
    var data = {
            player: left + '799' + right,
            team: RED,
            charClass: "Engineer"
        };
    xhr('POST', base_url + '/api/private/disconnected', JSON.stringify(data));
}

function disconnect2() {
    var data = {
            player: left + '800' + right,
            team: RED,
            charClass: "Heavy"
        };
    xhr('POST', base_url + '/api/private/disconnected', JSON.stringify(data));
}

function disconnect3() {
    var data = {
            player: left + '801' + right,
            team: RED,
            charClass: "Medic"
        };
    xhr('POST', base_url + '/api/private/disconnected', JSON.stringify(data));
}

function disconnect4() {
    var data = {
            player: left + '802' + right,
            team: BLUE,
            charClass: "Soldier"
        };
    xhr('POST', base_url + '/api/private/disconnected', JSON.stringify(data));
}

function disconnect5() {
    var data = {
            player: left + '803' + right,
            team: BLUE,
            charClass: "Spy"
        };
    xhr('POST', base_url + '/api/private/disconnected', JSON.stringify(data));
}

function disconnect6() {
    var data = {
            player: left + '804' + right,
            team: BLUE,
            charClass: "Medic"
        };
    xhr('POST', base_url + '/api/private/disconnected', JSON.stringify(data));
}

function teamSwitch1() {
    var data = {
            player: left + '799' + right,
            team: 0,
            charClass: "Engineer"
        };
    xhr('POST', base_url + '/api/private/teamswitch', JSON.stringify(data));
}

function teamSwitch2() {
    var data = {
            player: left + '799' + right,
            team: 1,
            charClass: "Engineer"
        };
    xhr('POST', base_url + '/api/private/teamswitch', JSON.stringify(data));
}

function respawn1() {
  var data = {
    player: left + '799' + right,
    team: RED,
    charClass: "Engineer"
  };
  xhr('POST', base_url + '/api/private/respawn', JSON.stringify(data));
}

function respawn2() {
  var data = {
    player: left + '800' + right,
    team: BLUE,
    charClass: "Heavy"
  };
  xhr('POST', base_url + '/api/private/respawn', JSON.stringify(data));
}


function respawn3() {
    var data = {
      player: left + '801' + right,
      team: RED,
      charClass: "Medic"
    };
    xhr('POST', base_url + '/api/private/respawn', JSON.stringify(data));
}

function respawn4() {
    var data = {
      player: left + '802' + right,
      team: BLUE,
      charClass: "Soldier"
    };
    xhr('POST', base_url + '/api/private/respawn', JSON.stringify(data));
}

function respawn5() {
  var data = {
    player: left + '803' + right,
    team: BLUE,
    charClass: "Spy"
  };
  xhr('POST', base_url + '/api/private/respawn', JSON.stringify(data));
}

function respawn6() {
  var data = {
    player: left + '804' + right,
    team: BLUE,
    charClass: "Medic"
  };
  xhr('POST', base_url + '/api/private/respawn', JSON.stringify(data));
}

function playerScores() {
    var data = {
            red_players: [
              { player:left + '799' + right, score:4, charClass: "Engineer" },
              { player:left + '800' + right, score:5, charClass: "Heavy" },
              { player:left + '801' + right, score:6, charClass: "Medic" }
            ],
            blu_players: [
              { player:left + '802' + right, score:7, charClass: "Soldier" },
              { player:left + '803' + right, score:8, charClass: "Spy" },
              { player:left + '804' + right, score:9, charClass: "Medic" }
            ]
        };
    xhr('POST', base_url + '/api/private/playerscores', JSON.stringify(data));
}