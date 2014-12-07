/** @jsx React.DOM */
var React = require('react');
var TeamMemberRow = require('../components/TeamMemberRow.react');

var TeamMemberTable = React.createClass({
  render: function() {
    var rows = [];

    this.props.members.forEach(function(member) {
      rows.push(<TeamMemberRow member={member} />);
    });

    return (
      <div className="panel-body">
        <table className="table table-striped table-hover">
          <thead>
            <tr>
              <th></th>
              <th>Name</th>
              <th></th>
              <th>Class</th>
              <th>Score</th>
            </tr>
          </thead>
          <tbody>
            {rows}
          </tbody>
        </table>
      </div>
    );
  }
});

module.exports = TeamMemberTable;
