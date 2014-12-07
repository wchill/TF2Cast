/** @jsx React.DOM */
var React = require('react');
var TeamOverview = require('../components/TeamOverview.react');
var TeamMemberTable = require('../components/TeamMemberTable.react');

var Team = React.createClass({
  render: function() {
    return (
      <div className="panel">
        <TeamOverview team={this.props.team} />
        <TeamMemberTable members={this.props.team.members} />
      </div>
    );
  }
});

module.exports = Team;
