# AETHELGARD MERGED FILE
# Origin Repository: pearai-app-main
# Original Path: extensions\vscode-colorize-tests\test\colorize-fixtures\test.jsx
# Merge Date: 2026-05-07T19:22:33.459376
# ---

var ToggleText = React.createClass({
  getInitialState: function () {
    return {
      showDefault: true
    }
  },

  toggle: function (e) {
    // Prevent following the link.
    e.preventDefault();

    // Invert the chosen default.
    // This will trigger an intelligent re-render of the component.
    this.setState({ showDefault: !this.state.showDefault })
  },

  render: function () {
    // Default to the default message.
    var message = this.props.default;

    // If toggled, show the alternate message.
    if (!this.state.showDefault) {
      message = this.props.alt;
    }

    return (
      <div>
        <h1>Hello {message}!</h1>
        <a href="" onClick={this.toggle}>Toggle</a>
      </div>
    );
  }
});

React.render(<ToggleText default="World" alt="Mars" />, document.body);