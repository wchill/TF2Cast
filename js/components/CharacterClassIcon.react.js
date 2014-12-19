/** @jsx React.DOM */
var React = require('react');

var _DEFAULT_CLASS = "../../static/img/noclass.png";

var CharacterClassIcon = React.createClass({
  render: function() {
    var charClass = this.props.player.charClass === "" ? _DEFAULT_CLASS : ("../../static/img/" + this.props.charClass + ".png");
    
    return (
      <img src={charClass} />
    );
  }
});

module.exports = CharacterClassIcon;
