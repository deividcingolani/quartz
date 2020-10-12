import React, { Component } from 'react';

export interface ErrorBoundaryProps {
  children: React.ReactElement;
}

interface ErrorBoundaryState {
  error?: Error;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);

    this.state = {};
  }

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  render(): React.ReactNode {
    const { children } = this.props;
    const { error } = this.state;

    if (error) {
      return (
        <div>
          <h1>Something went wrong.</h1>
          <p>{error.message}</p>
        </div>
      );
    }

    return children;
  }
}

export default ErrorBoundary;
