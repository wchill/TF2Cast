var React = require('react');
var TeamStore = require('../stores/TeamStore');
var Constants = require('../constants/Constants');

var Messages = React.createClass({

  _renderMessage: function(message) {
    switch(message.type) {
      case 'death' :
        var data = message.data.message;
        data.attacker = TeamStore.getPlayerName(data.attacker);
        data.victim = TeamStore.getPlayerName(data.victim);

        // Correctly color kills, suicides, and fratricide
        var attacker_color = data.attacker_team === Constants.RED ? 'redTeam' : 'blueTeam';
        var victim_color = data.victim_team === Constants.RED ? 'redTeam' : 'blueTeam';

        return (<li key={message.id}>
          <span className={attacker_color}>{data.attacker}</span>
          &nbsp;killed&nbsp;
          <span className={victim_color}>{data.victim}</span>
        </li>);

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
