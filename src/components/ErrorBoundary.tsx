import React from "react";

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      hasError: false,
    };
  }

  static getDerivedStateFromError(): State {
    return {
      hasError: true,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Unexpected application error:", error);
    console.error(errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="auth-page">
          <div
            className="auth-card"
            style={{
              textAlign: "center",
              maxWidth: "520px",
            }}
          >
            <p className="eyebrow">UriPet</p>

            <h2>Something went wrong</h2>

            <p
              style={{
                color: "#64748b",
                marginBottom: "24px",
              }}
            >
              An unexpected error occurred while loading this page. Please
              refresh the application and try again.
            </p>

            <button
              className="primary-button"
              type="button"
              onClick={() => window.location.reload()}
            >
              Reload Application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;