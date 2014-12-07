/** @jsx React.DOM */

var React = require('react');
var Scoreboard = require('../components/Scoreboard.react');
var Notifications = require('../components/Notifications.react');
var ServerInfo = require('../components/ServerInfo.react')
var MessageStore = require('../stores/MessageStore');
var xhr = require('../utils/xhr');

/******************************************************
  *
  * Static Version (i.e. no usage of STATE at all)
  *
  *******************************************************/
  // React Components:
  // - (TODO) NotificationBar - displays new real-time notifications (e.g. in-game deaths)
  // - Scoreboard - contains the entirety of the match data
  // - Team - displays the entirety of a team's match data
  // - TeamOverview - displays basic team information (e.g. color, name, score, size)
  // - TeamMemberTable - displays the match data for a team's members
  // - TeamMemberRow - displays a row for each team member
  // - ServerInfo - displays server connection information

  // React Component Hierarchy:
  // - NotificationBar
  // - Scoreboard
  //     - Team
  //         - TeamOverview
  //         - TeammateTable
  //           - TeammateRow
  // - ServerInfo

var steam_key = "8FB18602A84F393E886D7E47F8FCF2D1";
var steam_url = "/ISteamUser/GetPlayerSummaries/v0002/?key=" + steam_key;
var player_info_url = steam_url + "&steamids=";

// player ids should be strings
function request_players(player_ids) {
  var requset_url = player_info_url;
  for (var i = 0; i < player_ids.length; i++) {
    console.log(player_ids[i]);
    requset_url += player_ids[i];
    requset_url += ','
  }
  var headers = {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
  };
  xhr('GET', requset_url, {})
    .success(function(data) {
      // this.setState({

      // });
      console.log(data.response.players);
    }.bind(this));
}

function last_five(messages) {
  if (messages.length <= 5) {
    return messages;
  } else {
    return messages.slice(-5);
  }
}

function getState() {
  return {
    messages: last_five(MessageStore.getMessages())
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
              <Scoreboard teams={this.props.teams} />
            </div>

            <div className="row">
              <ServerInfo server={this.props.server} />
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
