/** @jsx React.DOM */

var React = require('react');
var Team = require('../components/Team.react');
var ServerInfo = require('../components/ServerInfo.react');

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

var Scoreboard = React.createClass({
  render: function() {
    var blu = this.props.teams[0];
    var red = this.props.teams[1];

    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-6">
            <Team team={blu} />
          </div>
          <div className="col-md-6">
            <Team team={red} />
          </div>
        </div>
        <div className="row">
          <div className="col-md-12">
            <ServerInfo server={this.props.server} />
          </div>
        </div>
      </div>
    );
  }
});
console.log("1b");

module.exports = Scoreboard;
