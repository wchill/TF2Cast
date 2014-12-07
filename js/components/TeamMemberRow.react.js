/** @jsx React.DOM */
var React = require('react');

var TeamMemberRow = React.createClass({
  render: function() {
    var avatar = this.props.member.avatar === "" ? "_" : this.props.member.avatar;
    var alive = this.props.member.alive ? "" : "DEAD";

    return (
      <tr>
      <td>{avatar}</td>
      <td>{this.props.member.name}</td>
      <td>{alive}</td>
      <td>{this.props.member.charClass}</td>
      <td>{this.props.member.score}</td>
      </tr>
    );
  }
});

module.exports = TeamMemberRow;
