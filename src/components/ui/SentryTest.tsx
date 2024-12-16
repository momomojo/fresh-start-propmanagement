import { useEffect } from 'react';
import * as Sentry from '@sentry/react';
import { Button } from './button';
import { captureError, addBreadcrumb } from '@/lib/monitoring';

export const SentryTest = () => {
    useEffect(() => {
        // Test breadcrumb
        addBreadcrumb(
            'SentryTest component mounted',
            'test',
            'info'
        );
    }, []);

    const handleTestError = () => {
        try {
            // Generate a test error
            throw new Error('Test error from SentryTest component');
        } catch (error) {
            if (error instanceof Error) {
                captureError(error, {
                    component: 'SentryTest',
                    action: 'test error',
                    timestamp: new Date().toISOString(),
                });
            }
        }
    };

    const handleTestPerformance = () => {
        // Create a test transaction using browser tracing
        const transaction = Sentry.getCurrentHub().getClient()?.getOptions().integrations?.find(
            (i) => i.name === 'BrowserTracing'
        );

        if (transaction) {
            // Add a breadcrumb for the performance test
            addBreadcrumb(
                'Performance test initiated',
                'performance',
                'info'
            );

            // Simulate some work
            setTimeout(() => {
                addBreadcrumb(
                    'Performance test completed',
                    'performance',
                    'info'
                );
            }, 2000);
        }
    };

    return (
        <div className="p-4 space-y-4">
            <h2 className="text-lg font-semibold">Sentry Test Panel</h2>
            <div className="space-x-4">
                <Button onClick={handleTestError} variant="destructive">
                    Test Error Tracking
                </Button>
                <Button onClick={handleTestPerformance} variant="outline">
                    Test Performance
                </Button>
            </div>
            <p className="text-sm text-gray-500 mt-4">
                Note: Check the Sentry dashboard to verify that errors and performance data are being captured.
            </p>
        </div>
    );
};
