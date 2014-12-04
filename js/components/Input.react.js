var React = require('react');
var Actions = require('../Actions/Actions');

var Input = React.createClass({
  getInitialState: function() {
    return {
      value: ''
    };
  },

  _handleChange: function(event) {
    this.setState({value: event.target.value});
  },

  _handleSend: function(event) {
    event.preventDefault();
    if (!this.state.value) {
      return;
    }
    Actions.messageSend({text: this.state.value});
    this.setState({value: ''});
  },

  render: function() {
    return (
      <form action="" onSubmit={this._handleSend}>
        <input id="m" value={this.state.value} onChange={this._handleChange} />
      </form>
    );
  }
});

module.exports = Input;
