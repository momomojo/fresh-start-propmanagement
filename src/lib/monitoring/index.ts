import * as Sentry from '@sentry/react';

export const initializeMonitoring = () => {
  if (import.meta.env.PROD) {
    Sentry.init({
      dsn: import.meta.env.VITE_SENTRY_DSN,
      integrations: [
        Sentry.browserTracingIntegration(),
        Sentry.replayIntegration(),
      ],
      // Performance Monitoring
      tracesSampleRate: 1.0,
      // Session Replay
      replaysSessionSampleRate: 0.1, // Sample 10% of sessions
      replaysOnErrorSampleRate: 1.0, // Sample 100% of sessions with errors
      // Environment and Release
      environment: import.meta.env.MODE,
      release: process.env.VITE_RELEASE_VERSION || '0.1.0',
      // Enable automatic instrumentation
      enableTracing: true,
      // Error Dialog
      beforeSend(event) {
        // Don't send errors in development
        if (import.meta.env.DEV) {
          return null;
        }
        // Show report dialog for exceptions in production
        if (event.exception) {
          Sentry.showReportDialog({
            eventId: event.event_id,
            // User feedback options
            title: 'We\'re sorry, something went wrong.',
            subtitle: 'Our team has been notified.',
            subtitle2: 'If you\'d like to help, tell us what happened below.',
            labelName: 'Name',
            labelEmail: 'Email',
            labelComments: 'What happened?',
            errorGeneric: 'An unknown error occurred while submitting your report. Please try again.',
            errorFormEntry: 'Some fields were invalid. Please correct the errors and try again.',
            successMessage: 'Your feedback has been sent. Thank you!'
          });
        }
        return event;
      },
    });
  }
};

export const captureError = (error: Error, context?: Record<string, any>) => {
  console.error(error);
  if (import.meta.env.PROD) {
    Sentry.captureException(error, {
      extra: context,
    });
  }
};

export const setUserContext = (user: { id: string; email: string; role: string }) => {
  if (import.meta.env.PROD) {
    Sentry.setUser({
      id: user.id,
      email: user.email,
      role: user.role,
    });
  }
};

export const addBreadcrumb = (
  message: string,
  category?: string,
  level?: Sentry.SeverityLevel
) => {
  if (import.meta.env.PROD) {
    Sentry.addBreadcrumb({
      message,
      category,
      level,
      timestamp: Date.now() / 1000,
    });
  }
};

export const setTag = (key: string, value: string) => {
  if (import.meta.env.PROD) {
    Sentry.setTag(key, value);
  }
};

// Performance monitoring helper
export const withProfiler = <P extends object>(
  Component: React.ComponentType<P>,
  name?: string
): React.ComponentType<P> => {
  if (import.meta.env.PROD) {
    return Sentry.withProfiler(Component, { name });
  }
  return Component;
};
