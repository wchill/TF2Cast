/** @jsx React.DOM */
var React = require('react');

var Spectators = React.createClass({
  render: function() {
    var list = "";
    this.props.spectators.players.forEach(function(spectator) {
      list += spectator.name + ', ';
    });

    if (list.length >= 2) {
      list = list.substring(0, list.length - 2);
    }

    return (<div className="alert alert-info">Spectators: <span>{list}</span></div>);
  }
});

module.exports = Spectators;
