/** @jsx React.DOM */

var React = require('react');
var Team = require('../components/Team.react');
var Constants = require('../constants/Constants');

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
