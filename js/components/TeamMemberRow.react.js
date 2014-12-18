/** @jsx React.DOM */
var React = require('react');

var TeamMemberRow = React.createClass({
  render: function() {
    var avatar = this.props.player.avatar === "" ? "_" : this.props.player.avatar;
    var alive = this.props.player.alive ? "" : "DEAD";

    return (
      <tr>
      <td>{avatar}</td>
      <td>{this.props.player.name}</td>
      <td>{alive}</td>
      //<td>{this.props.player.charClass}</td>
      <td>{this.props.player.score}</td>
      </tr>
    );
  }
});

module.exports = TeamMemberRow;
