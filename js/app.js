/** @jsx React.DOM */

var React = require('react');
var Actions = require('./Actions/Actions');
var TF2 = require('./components/TF2.react');
var socketHandler = require('./socketHandler');

// Static Test Data
var SERVER= {"name": "StarHub TeamFortress 2 #5 [golddust4ever]"};

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

var _messages = [
    {text: 'Welcome to team fortress 2 Stream!', id: 0}
]; 

React.render(
  <TF2 teams={TEAMS} server={SERVER} messages={_messages}/>,
  document.getElementById('scoreboard-container')
);

socketHandler.init();
