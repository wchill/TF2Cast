/** @jsx React.DOM */

var React = require('react');
var Scoreboard = require('../components/Scoreboard.react');
var Notifications = require('../components/Notifications.react');
var Spectators = require('../components/Spectators.react')
var MessageStore = require('../stores/MessageStore');
var TeamStore = require('../stores/TeamStore');

// React Components:
// - Scoreboard - contains the entirety of the match data
// - Team - displays the entirety of a team's match data
// - TeamOverview - displays basic team information (e.g. color, name, score, size)
// - TeamMemberTable - displays the match data for a team's members
// - TeamMemberRow - displays a row for each team member
// - TeamMemberAvatar - displays the player's Steam avatar or a default one
// - TeamMemberDeath - displays a killed icon
// - CharacterClassIcon - displays a player's character class icon
// - Spectators - displays all the spectators in a comma separated list
// - Messages - displays the latest 5 kills in the game (in real time)

// React Component Hierarchy:
// - TF2
//   - Scoreboard
//       - Team
//           - TeamOverview
//           - TeammateTable
//             - TeamMemberRow
//               - TeamMemberAvatar
//               - TeamMemberDeath
//               - CharacterClassIcon
// - Spectators
// - Messages

function lastFive(messages) {
  if (messages.length <= 5) {
    return messages;
  } else {
    return messages.slice(-5);
  }
}

function getState() {
  return {
    messages: lastFive(MessageStore.getMessages()),
    teams: TeamStore.getTeams(),
    spectators: TeamStore.getSpectators()
  };
}

var TF2 = React.createClass({
  getInitialState: function() {
    return getState();
  },

  componentDidMount: function() {
    MessageStore.addChangeListener(this._onChange);
    TeamStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
    MessageStore.removeChangeListener(this._onChange);
    TeamStore.removeChangeListener(this._onChange);
  },

  _onChange: function() {
    this.setState(getState());
  },

  render: function() {
    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-9">
            <div className='row'>
              <Scoreboard teams={this.state.teams} />
            </div>
            <div className="row">
              <Spectators spectators={this.state.spectators} />
            </div>
          </div>
          <div className="col-md-3">
            <Notifications messages={this.state.messages} />
          </div>
        </div>

      </div>
    );
  }
});

module.exports = TF2;
