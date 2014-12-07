var React = require('react');
var Messages = require('../components/Messages.react');

var Notifications = React.createClass({

  render: function() {
    return (
      <div>
        <Messages messages={this.props.messages} />
      </div>
    );
  }

});

module.exports = Notifications;
