import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  fallback?: ReactNode;
  children?: ReactNode;
}

interface State {
  errMessage: string;
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      errMessage: '',
      hasError: false,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      errMessage: error.toString(),
      hasError: true,
    };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.log('an error occured');
    console.log(error, info.componentStack);
    console.error(error.message);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
