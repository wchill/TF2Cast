var React = require('react');

var Messages = React.createClass({

  _renderMessage: function(message) {
    switch(message.type) {
      case 'death' :
        var data = message.data.message;
        console.log(data);
        if (data.attacker_team == 1) {
          return <li key={message.id}>
            <span className='redTeam'>{data.attacker}</span>
            &nbsp;killed&nbsp;
            <span className='blueTeam'>{data.victim}</span>
          </li>;
        } else {
          return <li key={message.id}>
            <span className='blueTeam'>{data.attacker}</span>
            &nbsp;killed&nbsp;
            <span className='redTeam'>{data.victim}</span>
          </li>;
        }
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
