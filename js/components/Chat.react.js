var React = require('react');
var Messages = require('../components/Messages.react');
var MessageStore = require('../stores/MessageStore');
var Input = require('../components/Input.react');

function getState() {
  return {
    messages: MessageStore.getMessages()
  };
}

var Chat = React.createClass({

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
      <div>
        <Messages messages={this.state.messages} />
      </div>
    );
  }

});

module.exports = Chat;
