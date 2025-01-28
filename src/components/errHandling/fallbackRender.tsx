import { Component } from 'react';

class ErrFallbackComponent extends Component {
  render() {
    return (
      <div role="alert">
        <div>An error was thrown:</div>
        <p>Something went wrong...</p>
      </div>
    );
  }
}

export default ErrFallbackComponent;
