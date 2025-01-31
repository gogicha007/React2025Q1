import { Component } from 'react';

type Props = Record<string, never>;

type State = {
  shouldThrowError: boolean;
};

class ErrorButton extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      shouldThrowError: false,
    };
  }

  errorThrown = () => {
    this.setState({ shouldThrowError: true });
    throw new Error('Oops...');
  };

  render() {
    const { shouldThrowError } = this.state;

    if (shouldThrowError) {
      throw new Error('Error throwing button was clicked');
    }
    return (
      <button type="button" onClick={this.errorThrown}>
        Error Thrower
      </button>
    );
  }
}

export default ErrorButton;
