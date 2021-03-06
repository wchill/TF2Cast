/** @jsx React.DOM */
var React = require('react');
var TeamMemberAvatar = require('../components/TeamMemberAvatar.react');
var TeamMemberDeath = require('../components/TeamMemberDeath.react');
var CharacterClassIcon = require('../components/CharacterClassIcon.react');

var TeamMemberRow = React.createClass({
  render: function() {
    return (
      <tr>
      <td><TeamMemberAvatar avatar={this.props.player.avatar} /></td>
      <td>{this.props.player.name}</td>
      <td><TeamMemberDeath alive={this.props.player.alive} /></td>
      <td><CharacterClassIcon charClass={this.props.player.charClass} /></td>
      <td className="playerScoreCol">{this.props.player.score}</td>
      </tr>
    );
  }
});

module.exports = TeamMemberRow;
