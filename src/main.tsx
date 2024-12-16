import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import * as Sentry from '@sentry/react';
import './lib/firebase/config';
import { initializeMonitoring } from './lib/monitoring';
import App from './App.tsx';
import './index.css';

// Initialize Sentry monitoring
initializeMonitoring();

// Create Sentry error boundary wrapper
const SentryErrorBoundary = Sentry.ErrorBoundary;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SentryErrorBoundary
      fallback={
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
          <div className="p-8 bg-white rounded-lg shadow-md">
            <h1 className="text-2xl font-bold text-red-600 mb-4">
              An error has occurred
            </h1>
            <p className="text-gray-600">
              Our team has been notified and is working to fix the issue.
            </p>
          </div>
        </div>
      }
    >
      <App />
    </SentryErrorBoundary>
  </StrictMode>
);
