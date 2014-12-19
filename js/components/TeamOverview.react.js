/** @jsx React.DOM */
var React = require('react');
var Constants = require('../constants/Constants');

var TeamOverview = React.createClass({
  render: function() {
    var playerCount = this.props.team.players.length;
    var name = this.props.team.id === Constants.RED ? "RED" : "BLU";

    return (
      <div className="panel-heading>">
        <div className="row">
        <div className="col-md-4"><h3>{name}</h3></div>
        <div className="col-md-4"><h3>{playerCount} players</h3></div>
        <div className="col-md-4"><h3>{this.props.team.score}</h3></div>
        </div>
      </div>
    );
  }
});

module.exports = TeamOverview;
