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
  // var _victim = req.body.victim;
  // var _attacker = req.body.attacker;
  // var _assister = req.body.assister;
  // var _weapon = req.body.weapon;
  // var _death_type = req.body.death_type;
  // var _victim_team = req.body.victim_team;
  // var _attacker_team = req.body.attacker_team;
  // var _assister_team = req.body.assister_team;

  if(!_errors.length)
    io.emit('death', req.body);
  res.json(_errors);
});

app.post('/api/private/respawn', function(req, res) {
  var _errors = [];
  if (!_errors.length)
    io.emit('respawn', req.body);

  res.json(_errors);
});

app.post('/api/private/connected', function(req, res) {
  var _errors = [];

  io.emit('connected', req.body);

  res.json(_errors);
});

app.post('/api/private/disconnected', function(req, res) {
  var _errors = [];

  if (!_errors.length)
    io.emit('disconnected', req.body);

  res.json(_errors);
});

app.post('/api/private/teamswitch', function(req, res) {
  var _errors = [];

  if (!_errors.length)
    io.emit('teamswitch', req.body);

  res.json(_errors);
});

app.post('/api/private/playerscores', function(req, res) {
  var _errors = [];

  if (!_errors.length)
    io.emit('playerscores', req.body);

  res.json(_errors);
});

app.post('/api/private/roundover', function(req, res) {
  var _errors = [];

  if (!_errors.length)
    io.emit('roundover', req.body);

  res.json(_errors);
});
