/** @jsx React.DOM */

var React = require('react');
var TF2 = require('./components/TF2.react');
var socketHandler = require('./socketHandler');


React.render(
  <TF2 />,
  document.getElementById('scoreboard-container')
);

socketHandler.init();
