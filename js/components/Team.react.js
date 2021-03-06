/** @jsx React.DOM */
var React = require('react');
var TeamOverview = require('../components/TeamOverview.react');
var TeamMemberTable = require('../components/TeamMemberTable.react');

var Team = React.createClass({
  render: function() {
    return (
      <div className="panel">
        <TeamOverview team={this.props.team} />
        <TeamMemberTable players={this.props.team.players.sort(function(a, b) {
            return b.score - a.score;
        })} />
      </div>
    );
  }
});

module.exports = Team;
