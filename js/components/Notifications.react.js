var React = require('react');
var Messages = require('../components/Messages.react');
var MessageStore = require('../stores/MessageStore');
var Input = require('../components/Input.react');

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
