/** @jsx React.DOM */
var React = require('react');

var TeamOverview = React.createClass({
  render: function() {
    var playerCount = this.props.team.members.length;

    return (
      <div className="panel-heading>">
        <div className="row">
        <div className="col-md-4"><h3>{this.props.team.name}</h3></div>
        <div className="col-md-4"><h3>{playerCount} players</h3></div>
        <div className="col-md-4"><h3>{this.props.team.score}</h3></div>
        </div>
      </div>
    );
  }
});

module.exports = TeamOverview;
