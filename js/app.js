var React = require('react');
var Actions = require('./Actions/Actions');
var Chat = require('./components/Chat.react');

var socketHandler = require('./socketHandler');

React.render(
  <Chat />,
  document.getElementById('app')
);

socketHandler.init();
