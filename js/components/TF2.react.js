/** @jsx React.DOM */

var React = require('react');
var Scoreboard = require('../components/Scoreboard.react');
var Notifications = require('../components/Notifications.react');
var Spectators = require('../components/Spectators.react')
var MessageStore = require('../stores/MessageStore');
var TeamStore = require('../stores/TeamStore');
var xhr = require('../utils/xhr');

function last_five(messages) {
  if (messages.length <= 5) {
    return messages;
  } else {
    return messages.slice(-5);
  }
}

function getState() {
  return {
    messages: last_five(MessageStore.getMessages()),
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
  },

  componentWillUnmount: function() {
    MessageStore.removeChangeListener(this._onChange);
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
