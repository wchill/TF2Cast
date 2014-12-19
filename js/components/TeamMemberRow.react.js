/** @jsx React.DOM */
var React = require('react');
var TeamMemberAvatar = require('../components/TeamMemberAvatar.react');
var TeamMemberDeath = require('../components/TeamMemberDeath.react');

var TeamMemberRow = React.createClass({
  render: function() {
    return (
      <tr>
      <td><TeamMemberAvatar avatar={this.props.player.avatar} /></td>
      <td>{this.props.player.name}</td>
      <td><TeamMemberDeath alive={this.props.player.alive} /></td>
      <td>{this.props.player.charClass}</td>
      <td>{this.props.player.score}</td>
      </tr>
    );
  }
});

module.exports = TeamMemberRow;
