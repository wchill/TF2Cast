var React = require('react');

var Messages = React.createClass({
  _renderMessage: function(message) {
    return <li key={message.id}>{message.text}</li>;
  },

  render: function() {
    return (
      <ul id="messages">
        {this.props.messages.map(this._renderMessage)}
      </ul>
    );
  }
});

module.exports = Messages;
