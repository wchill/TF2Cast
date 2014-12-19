/** @jsx React.DOM */
var React = require('react');

var _DEFAULT_AVATAR = "../../static/img/steam_default_avatar_32.jpg";

var TeamMemberAvatar = React.createClass({
  render: function() {
    var avatar = this.props.avatar === "" ? _DEFAULT_AVATAR : this.props.avatar;

    return (
      <img src={avatar} />
    );
  }
});

module.exports = TeamMemberAvatar;
