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
  {text: 'Hi', id: 0}
];

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
  // test

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
  console.log(req.body);
  io.emit('message_from_server', createMessage(req.body.killer + ' has killed ' + req.body.killed))
  res.json(_errors);
});

app.post('/api/private/respawn', function(req, res) {
  res.json(_errors);
});

app.post('/api/private/connected', function(req, res) {
  res.json(_errors);
});

app.post('/api/private/disconnected', function(req, res) {
  res.json(_errors);
});

app.post('/api/private/teamswitch', function(req, res) {
  res.json(_errors);
});

app.post('/api/private/playerscores', function(req, res) {
  res.json(_errors);
});

app.post('/api/private/roundover', function(req, res) {
  res.json(_errors);
});
