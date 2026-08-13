import { Component } from "react";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("App crashed:", error, info);
  }

  handleReload = () => {
    this.setState({ hasError: false });
    window.location.href = "/dashboard";
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "16px",
            fontFamily: "sans-serif",
            background: "#F5F6FA",
            padding: "20px",
            textAlign: "center",
          }}
        >
          <h2 style={{ color: "#14213D" }}>Something went wrong</h2>
          <p style={{ color: "#6B7280" }}>
            Ye page load nahi ho paya. Dashboard pe wapas jaane ki koshish karo.
          </p>
          <button
            onClick={this.handleReload}
            style={{
              background: "#F5A623",
              color: "#14213D",
              padding: "10px 22px",
              borderRadius: "8px",
              fontWeight: 600,
              border: "none",
              cursor: "pointer",
            }}
          >
            Go to Dashboard
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
