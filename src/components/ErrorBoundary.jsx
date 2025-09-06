import React from "react";
import Icon from "./AppIcon";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    error.__ErrorBoundary = true;
    window.__COMPONENT_ERROR__?.(error, errorInfo);
    // // console.log("Error caught by ErrorBoundary:", error, errorInfo);
  }

  render() {
    if (this.state?.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-black">
          <div className="text-center p-8 max-w-md">
            <div className="flex justify-center items-center mb-6">
              <div className="w-16 h-16 bg-red-600/20 rounded-full flex items-center justify-center">
                <Icon name="AlertTriangle" size={32} className="text-red-400" />
              </div>
            </div>
            <div className="flex flex-col gap-2 text-center">
              <h1 className="text-2xl font-medium text-white">Something went wrong</h1>
              <p className="text-gray-400 text-base">We encountered an unexpected error while processing your request.</p>
            </div>
            <div className="flex justify-center items-center mt-6">
              <button
                onClick={() => {
                  window.location.href = "/";
                }}
                className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-6 rounded-xl flex items-center gap-2 transition-colors duration-200"
              >
                <Icon name="ArrowLeft" size={18} className="text-white" />
                Back to Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props?.children;
  }
}

export default ErrorBoundary;