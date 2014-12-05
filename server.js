var express = require('express')
  , bodyParser      = require('body-parser')
  , json            = require('json')
  , urlencode       = require('urlencode');
var app = express();
var server = require('http').Server(app);
server.listen(8000);
var io = require('socket.io')(server);
app.use(bodyParser());


var _messages = [
  {text: 'Welcome to team fortress 2 Stream!', id: 0}
];

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
    default:
      return 'error';
  }
}

// should eventually be removed
var _errors = [];

function createMessage(text) {
  var newMessage = {text: text, id: _messages.length};
  _messages.push(newMessage);
  return newMessage;
}

app.use('/', express.static(__dirname));

io.on('connection', function(socket) {
  socket.emit('messages_from_server', _messages);

  socket.on('message_from_client', function(message) {
    io.emit('message_from_server', createMessage(message.text));
  });

  socket.on('test_client', function(str) {
    io.emit('message_from_server', createMessage(str));
  });
});

app.post('/api/private/bootstrap', function(req, res) {
  res.json(_errors);
});

app.post('/api/private/death', function(req, res) {
  var _victim = req.body.victim;
  var _attacker = req.body.attacker;
  var _assister = req.body.assister;
  var _weapon = req.body.weapon;
  var _death_type = req.body.death_type;

  io.emit('message_from_server', createMessage(_attacker + ' has killed ' + 
                                              _victim + ' with ' +
                                              _weapon + ' by ' +
                                              _death_type + ' assisted by ' +
                                              _assister));
  res.json(_errors);
});

app.post('/api/private/respawn', function(req, res) {
  var _errors = [];
  var _player = req.body.player;
  var _class = req.body.class;

  io.emit('message_from_server', createMessage(_player + ' has respawned as a '+_class));

  res.json(_errors);
});

app.post('/api/private/connected', function(req, res) {
  var _player = req.body.player;

  io.emit('message_from_server', createMessage(_player + ' has connected'));

  res.json(_errors);
});

app.post('/api/private/disconnected', function(req, res) {
  var _player = req.body.player;

  io.emit('message_from_server', createMessage(_player + ' has disconnected'));

  res.json(_errors);
});

app.post('/api/private/teamswitch', function(req, res) {
  var _player = req.body.player;
  var _team = getTeam(req.body.team);

  io.emit('message_from_server', createMessage(_player + ' has switched to the '+_team+' team'));

  res.json(_errors);
});

app.post('/api/private/playerscores', function(req, res) {
  res.json(_errors);
});

app.post('/api/private/roundover', function(req, res) {
  var _winning_team = getTeam(req.body.winning_team);
  var _red_score = req.body.red_score;
  var _blue_score = req.body.blue_score;

  res.json(_errors);
});
