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

var steam_key = "8FB18602A84F393E886D7E47F8FCF2D1";
var steam_url = "/ISteamUser/GetPlayerSummaries/v0002/?key=" + steam_key;
var player_info_url = steam_url + "&steamids=";

function request_players(player_ids) {
  var requset_url = player_info_url;
  for (var i = 0; i < player_ids.length; i++) {
    requset_url += player_ids[i];
    requset_url += ','
  }
  var headers = {
      'Content-Type': 'application/json'
  };

  // Configure the request
  var options = {
      url: requset_url,
      method: 'GET',
      headers: headers,
  };
  request(options, function(res) {
    return res.response.players;
  }
}

var _messages = [];

function getTeam(teamNum) {
  teamNum = +teamNum;
  switch(teamNum) {
    case -1:
      return 'none';
    case 0:
      return 'red';
    case 1:
      return 'blue';
    case 2:
      return 'spectator';
    case 3:
      return 'tie';
    default:
      return 'error';
  }
}

function resetMessages() {
  _messages = [
    {text: 'Welcome to team fortress 2 Stream!', id: 0}
  ]; 
}
function createMessage(text) {
  var newMessage = {text: text, id: _messages.length};
  _messages.push(newMessage);
  return newMessage;
}

app.use('/', express.static(__dirname));

io.on('connection', function(socket) {
  resetMessages();
  socket.emit('messages_from_server', _messages);

  socket.on('test_client', function(str) {
    io.emit('message_from_server', createMessage(str));
  });
});

app.post('/api/private/bootstrap', function(req, res) {
  var _errors = [];
  res.json(_errors);
});

app.post('/api/private/death', function(req, res) {
  var _errors = [];
  var _victim = req.body.victim;
  var _attacker = req.body.attacker;
  var _assister = req.body.assister;
  var _weapon = req.body.weapon;
  var _death_type = req.body.death_type;
  var _victim_team = req.body.victim_team;
  var _attacker_team = req.body.attacker_team;
  var _assister_team = req.body.assister_team;

  if (_victim_team === 'error') {
    _errors.push('error calculating victim team');
  }
  if (_attacker_team === 'error') {
    _errors.push('error calculating attacker team');
  }
  if (_assister_team === 'error') {
    _errors.push('error calculating assister team');
  }

  if(!_errors.length)
    io.emit('message_from_server', createMessage(_attacker + ' has killed ' +
                                              _victim + ' with ' +
                                              _weapon + ' by ' +
                                              _death_type + ' assisted by ' +
                                              _assister));
  res.json(_errors);
});

app.post('/api/private/respawn', function(req, res) {
  var _errors = [];
  var _errors = [];
  var _player = req.body.player;
  var _class = req.body.class;
  var _team = req.body.team;

  if (_team === 'error') {
    _errors.push('error calculating team');
  }

  if (!_errors.length)
    io.emit('message_from_server', createMessage(_player + ' has respawned as a '+_class));

  res.json(_errors);
});

app.post('/api/private/connected', function(req, res) {
  var _errors = [];
  var _player = req.body.player;

  io.emit('message_from_server', createMessage(_player + ' has connected'));

  res.json(_errors);
});

app.post('/api/private/disconnected', function(req, res) {
  var _errors = [];
  var _player = req.body.player;
  var _team = req.body.team;

  if (_team === 'error') {
    _errors.push('error calculating team');
  }

  if (!_errors.length)
    io.emit('message_from_server', createMessage(_player + ' has disconnected'));

  res.json(_errors);
});

app.post('/api/private/teamswitch', function(req, res) {
  var _errors = [];
  var _player = req.body.player;
  var _team = getTeam(req.body.team);

  if (_team === 'error') {
    _errors.push('error calculating team');
  }

  if (!_errors.length)
    io.emit('message_from_server', createMessage(_player + ' has switched to the '+_team+' team'));

  res.json(_errors);
});

app.post('/api/private/playerscores', function(req, res) {
  var _errors = [];
  res.json(_errors);
});

app.post('/api/private/roundover', function(req, res) {
  var _errors = [];
  var _winning_team = getTeam(req.body.winning_team);
  var _red_score = req.body.red_score;
  var _blue_score = req.body.blue_score;

  if (_winning_team === 'error') {
    _errors.push('error calculating winning team');
  }

  if (!_errors.length)
  res.json(_errors);
});
