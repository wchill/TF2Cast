/** @jsx React.DOM */
var React = require('react');

var _DEFAULT_DEATH = "../../static/img/tf2_dead.png";

var TeamMemberDeath = React.createClass({
  render: function() {
    var dead = this.props.alive ? "": _DEFAULT_DEATH;
    return (
      <img src={dead} />
    );
  }
});

module.exports = TeamMemberDeath;
