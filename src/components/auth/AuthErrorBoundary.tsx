import React, { Component, ErrorInfo } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { auth } from '@/lib/firebase/config';
import { tokenService } from '@/lib/services/tokenService';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class AuthErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Auth Error:', error, errorInfo);
  }

  private handleLogout = async () => {
    try {
      await auth.signOut();
      tokenService.clearToken();
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  private handleRetry = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
          <div className="text-center">
            <AlertTriangle className="mx-auto h-12 w-12 text-red-500" />
            <h3 className="mt-2 text-lg font-semibold text-gray-900 dark:text-white">
              Authentication Error
            </h3>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              {this.state.error?.message || 'An authentication error occurred'}
            </p>
            <div className="mt-4 space-x-4">
              <Button onClick={this.handleRetry} variant="outline">
                Retry
              </Button>
              <Button onClick={this.handleLogout} variant="destructive">
                Logout
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}