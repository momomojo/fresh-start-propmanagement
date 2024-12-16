import { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Stats } from '@/components/ui/Stats';
import { SentryTest } from '@/components/ui/SentryTest';
import { withProfiler } from '@/lib/monitoring';

const Dashboard = () => {
  useEffect(() => {
    // Initialize any dashboard data
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Overview of your property management system
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Stats
            title="Properties"
            value="12"
            description="Total properties managed"
          />
          <Stats
            title="Units"
            value="48"
            description="Total units across properties"
          />
          <Stats
            title="Occupancy"
            value="92%"
            description="Current occupancy rate"
          />
        </div>

        {/* Only show in development or for admin users */}
        {(import.meta.env.DEV || process.env.NODE_ENV === 'development') && (
          <Card>
            <CardHeader>
              <CardTitle>Development Tools</CardTitle>
            </CardHeader>
            <CardContent>
              <SentryTest />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

// Wrap with Sentry profiler
export default withProfiler(Dashboard, 'Dashboard');
