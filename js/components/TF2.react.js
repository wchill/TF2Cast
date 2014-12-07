/** @jsx React.DOM */

var React = require('react');
var Scoreboard = require('../components/Scoreboard.react');
var Notifications = require('../components/Chat.react');
var ServerInfo = require('../components/ServerInfo.react')

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

var TF2 = React.createClass({
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
            <Notifications messages={this.props.messages} />
          </div>
        </div>
        
      </div>
    );
  }
});

module.exports = TF2;
