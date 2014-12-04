var express = require('express');
var app = express();
var server = require('http').Server(app);
server.listen(8000);
var io = require('socket.io')(server);

var _messages = [
  {text: 'Hi', id: 0}
];

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