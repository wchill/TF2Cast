/** @jsx React.DOM */
var React = require('react');

var Spectators = React.createClass({
  render: function() {

    var list = "";

    this.props.spectators.players.forEach(function(spectator) {
      list += spectator.name + ', ';
    });
    list = list.substring(0, list.length-2);

    return (<div className="alert alert-info"><span>{list}</span></div>);
  }
});

module.exports = Spectators;
