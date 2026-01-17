"use client";

import React from 'react';
import { BiError, BiRefresh } from 'react-icons/bi';
import { Button } from '@/components/ui/button';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error?: Error | null; resetError: () => void }>;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error, errorInfo: null };
  }

  override componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({
      error,
      errorInfo
    });

    // 在生产环境中，这里可以发送错误报告到监控服务
    console.error('Error caught by boundary:', error, errorInfo);
  }

  resetError = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  override render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return <FallbackComponent error={this.state.error} resetError={this.resetError} />;
      }

      return <DefaultErrorFallback error={this.state.error} resetError={this.resetError} />;
    }

    return this.props.children;
  }
}

function DefaultErrorFallback({ error, resetError }: { error?: Error | null; resetError: () => void }) {
  return (
    <div className="min-h-[400px] flex items-center justify-center p-4">
      <div className="text-center space-y-4 max-w-md">
        <div className="flex justify-center">
          <BiError className="w-16 h-16 text-destructive" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-foreground">
            出现了一个错误
          </h2>
          <p className="text-sm text-muted-foreground">
            抱歉，页面出现了意外错误。请尝试刷新页面或联系技术支持。
          </p>
          {process.env.NODE_ENV === 'development' && error && (
            <details className="mt-4 text-left">
              <summary className="cursor-pointer text-sm font-medium text-destructive">
                错误详情 (开发模式)
              </summary>
              <pre className="mt-2 p-2 bg-muted rounded text-xs overflow-auto max-h-32">
                {error.message}
                {error.stack && `\n${error.stack}`}
              </pre>
            </details>
          )}
        </div>
        <div className="flex gap-2 justify-center">
          <Button onClick={resetError} variant="outline" size="sm">
            <BiRefresh className="w-4 h-4 mr-2" />
            重试
          </Button>
          <Button
            onClick={() => window.location.reload()}
            variant="default"
            size="sm"
          >
            刷新页面
          </Button>
        </div>
      </div>
    </div>
  );
}

// Hook版本的错误边界 (React 18+)
export function useErrorHandler() {
  return (error: Error, errorInfo?: { componentStack?: string }) => {
    console.error('Error handled by hook:', error, errorInfo);

    // 在生产环境中发送到错误监控服务
    if (process.env.NODE_ENV === 'production') {
      // 这里可以集成错误监控服务，如 Sentry
      // Sentry.captureException(error, { contexts: { react: { componentStack: errorInfo?.componentStack } } });
    }
  };
}

export default ErrorBoundary;