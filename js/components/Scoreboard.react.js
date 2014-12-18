/** @jsx React.DOM */

var React = require('react');
var Team = require('../components/Team.react');
var Constants = require('../constants/Constants');

/******************************************************
 *
 * Static Version (i.e. no usage of STATE at all)
 *
 *******************************************************/

// React Components:
// - Scoreboard - contains the entirety of the match data
// - Team - displays the entirety of a team's match data
// - TeamOverview - displays basic team information (e.g. color, name, score, size)
// - TeamMemberTable - displays the match data for a team's members
// - TeamMemberRow - displays a row for each team member

// React Component Hierarchy:
// - Scoreboard
//     - Team
//         - TeamOverview
//         - TeammateTable
//           - TeammateRow

var Scoreboard = React.createClass({
  render: function() {
    var blu = this.props.teams[Constants.BLU];
    var red = this.props.teams[Constants.RED];

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
      </div>
    );
  }
});

module.exports = Scoreboard;
