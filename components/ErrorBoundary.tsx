import React, { Component, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home, Bug } from 'lucide-react';
import Button from './Button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error to console in development
    console.error('Error Boundary caught an error:', error, errorInfo);
    
    this.setState({ errorInfo });
    
    // In production, you would send this to an error reporting service
    // Example: errorReportingService.log({ error, errorInfo });
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <div className="min-h-screen bg-bg-page flex items-center justify-center p-6">
          {/* Background effects */}
          <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0">
            <div className="absolute top-[-10%] right-[-10%] w-[800px] h-[800px] bg-red-500/5 rounded-full blur-[120px]" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[800px] h-[800px] bg-accent-secondary/5 rounded-full blur-[120px]" />
          </div>

          <div className="relative z-10 max-w-lg w-full text-center">
            {/* Error Icon */}
            <div className="mx-auto w-20 h-20 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center mb-8 animate-pulse">
              <AlertTriangle className="w-10 h-10 text-red-400" />
            </div>

            {/* Error Message */}
            <h1 className="text-3xl font-bold text-text-main mb-4">
              Something went wrong
            </h1>
            <p className="text-muted mb-8 leading-relaxed">
              An unexpected error occurred while rendering this component. 
              Our team has been notified and we're working on a fix.
            </p>

            {/* Error Details (Development Only) */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="mb-8 p-4 bg-bg-surface/50 border border-border-subtle rounded-xl text-left overflow-auto max-h-48">
                <div className="flex items-center gap-2 text-red-400 text-xs font-mono mb-2">
                  <Bug size={12} />
                  <span>Error Details (Dev Only)</span>
                </div>
                <pre className="text-xs text-muted font-mono whitespace-pre-wrap break-words">
                  {this.state.error.toString()}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={this.handleRetry} icon>
                <RefreshCw size={16} />
                Try Again
              </Button>
              <Button variant="outline" onClick={this.handleGoHome}>
                <Home size={16} />
                Go to Homepage
              </Button>
            </div>

            {/* Support Link */}
            <p className="mt-8 text-xs text-muted">
              If this problem persists, please{' '}
              <a 
                href="/contact" 
                className="text-accent-primary hover:underline"
              >
                contact our support team
              </a>
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
