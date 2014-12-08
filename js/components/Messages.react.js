var React = require('react');

var Messages = React.createClass({

  _renderMessage: function(message) {
    switch(message.type) {
      case 'death' :
        var data = message.data;
        return <li key={message.id}>
          <span className='redTeam'>{data.attacker}</span>
          killed
          <span className='blueTeam'>{data.victim}</span>
        </li>;
      default:
        return <li key={message.id}>{message.text}</li>;
    }
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
