/** @jsx React.DOM */
var React = require('react');

var ServerInfo = React.createClass({
  render: function() {
    return (<div className="alert alert-info">{this.props.server.name}</div>);
  }
});

module.exports = ServerInfo;
