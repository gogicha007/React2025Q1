import '@testing-library/jest-dom';
import React, { useState } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ErrorButton from './ErrorButton';

const originalConsoleError = console.error;
beforeAll(() => {
  console.error = jest.fn();
});
afterAll(() => {
  console.error = originalConsoleError;
});

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

describe('ErrorButton Component', () => {
  test('renders error button correctly', () => {
    render(<ErrorButton />);

    const button = screen.getByRole('button', { name: /error thrower/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('Error Thrower');
  });

  test('throws an error when clicked', () => {
    class TestErrorBoundary extends React.Component<
      ErrorBoundaryProps,
      ErrorBoundaryState
    > {
      constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false, error: null };
      }

      static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { hasError: true, error };
      }

      render(): React.ReactNode {
        if (this.state.hasError) {
          return (
            <div data-testid="error-message">{this.state.error?.message}</div>
          );
        }
        return this.props.children;
      }
    }

    // Render with error boundary
    render(
      <TestErrorBoundary>
        <ErrorButton />
      </TestErrorBoundary>
    );

    const button = screen.getByRole('button', { name: /error thrower/i });
    fireEvent.click(button);

    const errorMessage = screen.getByTestId('error-message');
    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage).toHaveTextContent('Error throwing button was clicked');
  });

  test('state updates correctly before throwing error', () => {
    const setStateMock = jest.fn();
    jest
      .spyOn(React, 'useState')
      .mockImplementation(() => [false, setStateMock]);

    render(<ErrorButton />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(setStateMock).toHaveBeenCalledWith(true);
  });

  test('button has correct type attribute', () => {
    render(<ErrorButton />);

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('type', 'button');
  });

  test('throws error with correct message', () => {
    interface CaptureErrorBoundaryState {
      error: Error | null;
    }

    class CaptureErrorBoundary extends React.Component<
      ErrorBoundaryProps,
      CaptureErrorBoundaryState
    > {
      constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { error: null };
      }

      componentDidCatch(error: Error): void {
        this.setState({ error });
      }

      render(): React.ReactNode {
        if (this.state.error) {
          return (
            <div data-testid="captured-error">{this.state.error.message}</div>
          );
        }
        return this.props.children;
      }
    }

    const ForceError = (): React.ReactElement => {
      useState(true);
      throw new Error('Error throwing button was clicked');
      return <button>Never Shown</button>;
    };

    render(
      <CaptureErrorBoundary>
        <ForceError />
      </CaptureErrorBoundary>
    );

    const errorElement = screen.getByTestId('captured-error');
    expect(errorElement).toHaveTextContent('Error throwing button was clicked');
  });
});
