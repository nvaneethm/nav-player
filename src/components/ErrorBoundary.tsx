import React, { Component, ReactNode } from "react";
import ErrorModal from "./ErrorModal";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  errorMessage: string;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, errorMessage: "" };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, errorMessage: error.message };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, errorMessage: "" });
    window.location.reload(); // Full page reload for recovery
  };

  render() {
    if (this.state.hasError) {
      return <ErrorModal message={this.state.errorMessage} onRetry={this.handleRetry} />;
    }
    return this.props.children;
  }
}

export default ErrorBoundary;