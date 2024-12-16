# Monitoring Setup Guide

This guide explains how to set up and configure monitoring for the Property Management application using Sentry.

## Sentry Integration

### 1. Environment Variables

The following environment variables are configured in your `.env` file and GitHub Secrets:

```bash
VITE_SENTRY_DSN=https://6e91a55b4f01a348d60cf4fba5f68a97@o4508478973476864.ingest.us.sentry.io/4508478995234816
VITE_SENTRY_AUTH_TOKEN=your-auth-token
VITE_SENTRY_ORG=o4508478973476864
VITE_SENTRY_PROJECT=4508478995234816
```

### 2. Loader Script

The Sentry Loader Script is included in `index.html`:

```html
<script src="https://js.sentry-cdn.com/6e91a55b4f01a348d60cf4fba5f68a97.min.js" crossorigin="anonymous"></script>
```

### 3. Security Headers

Security headers are configured in `index.html`:

```html
<meta http-equiv="Content-Security-Policy" content="report-uri https://o4508478973476864.ingest.us.sentry.io/api/4508478995234816/security/?sentry_key=6e91a55b4f01a348d60cf4fba5f68a97&sentry_environment=production&sentry_release=%VITE_RELEASE_VERSION%" />
<meta http-equiv="Expect-CT" content="report-uri=https://o4508478973476864.ingest.us.sentry.io/api/4508478995234816/security/?sentry_key=6e91a55b4f01a348d60cf4fba5f68a97" />
```

## Features

### 1. Error Tracking

```typescript
// src/lib/monitoring/index.ts
export const captureError = (error: Error, context?: Record<string, any>) => {
  console.error(error);
  if (import.meta.env.PROD) {
    Sentry.captureException(error, {
      extra: context,
    });
  }
};
```

### 2. User Context

```typescript
export const setUserContext = (user: { id: string; email: string; role: string }) => {
  if (import.meta.env.PROD) {
    Sentry.setUser({
      id: user.id,
      email: user.email,
      role: user.role,
    });
  }
};
```

### 3. Performance Monitoring

```typescript
export const withProfiler = <P extends object>(
  Component: React.ComponentType<P>,
  name?: string
): React.ComponentType<P> => {
  if (import.meta.env.PROD) {
    return Sentry.withProfiler(Component, { name });
  }
  return Component;
};
```

### 4. Breadcrumbs

```typescript
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
```

## Configuration

### 1. Performance Sampling

- `tracesSampleRate: 1.0` - Captures 100% of transactions
- `replaysSessionSampleRate: 0.1` - Captures 10% of sessions
- `replaysOnErrorSampleRate: 1.0` - Captures 100% of error sessions

### 2. Error Dialog

Custom error dialog configuration for user feedback:

```typescript
Sentry.showReportDialog({ 
  eventId: event.event_id,
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
```

## Usage Examples

### 1. Component Profiling

```typescript
import { withProfiler } from '@/lib/monitoring';

const MyComponent = () => {
  // Component code
};

export default withProfiler(MyComponent, 'MyComponent');
```

### 2. Error Capturing

```typescript
import { captureError } from '@/lib/monitoring';

try {
  // Risky operation
} catch (error) {
  captureError(error, { 
    operation: 'description',
    data: relevantData 
  });
}
```

### 3. User Tracking

```typescript
import { setUserContext } from '@/lib/monitoring';

const login = (user) => {
  setUserContext({
    id: user.uid,
    email: user.email,
    role: user.role
  });
};
```

### 4. Activity Tracking

```typescript
import { addBreadcrumb } from '@/lib/monitoring';

const handleAction = () => {
  addBreadcrumb(
    'User performed action',
    'user-action',
    'info'
  );
};
```

## CI/CD Integration

The CI/CD pipeline automatically:

1. Uploads source maps to Sentry
2. Creates Sentry releases
3. Associates commits with releases
4. Notifies Sentry of deployments

See `.github/workflows/ci.yml` for the complete configuration.

## Best Practices

1. **Error Handling**
   - Always use `captureError` for error tracking
   - Include relevant context with errors
   - Use breadcrumbs to track user journey
   - Profile performance-critical components

2. **Development**
   - Monitoring is disabled in development
   - Error dialog only shows in production
   - Source maps are only uploaded in production builds
   - Security headers are environment-specific

3. **Security**
   - DSN is public, but auth token is secret
   - User data is sanitized before sending
   - Error context is reviewed for sensitive data
   - Security headers are properly configured

## Troubleshooting

1. **Missing Error Reports**
   - Verify DSN in environment variables
   - Check Sentry initialization in index.html
   - Confirm error capturing in code
   - Review security headers

2. **Source Map Issues**
   - Check CI/CD pipeline logs
   - Verify release version configuration
   - Confirm source map generation
   - Review Sentry release artifacts

3. **Performance Issues**
   - Check sampling rates
   - Review profiled components
   - Monitor transaction volume
   - Analyze performance data

For additional help or questions, contact the development team.
