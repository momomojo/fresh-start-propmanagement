import React from 'react';
import { Building2, Users, DollarSign, Wrench } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import StatItem from '../components/ui/Stats';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';

const Dashboard: React.FC = () => {
  return (
    <div>
      <PageHeader 
        title="Dashboard"
        description="Overview of your property management metrics"
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatItem
          label="Total Properties"
          value="12"
          icon={<Building2 className="w-6 h-6 text-purple-600" />}
          trend={{ value: 8, isPositive: true }}
        />
        <StatItem
          label="Active Tenants"
          value="48"
          icon={<Users className="w-6 h-6 text-purple-600" />}
          trend={{ value: 12, isPositive: true }}
        />
        <StatItem
          label="Monthly Revenue"
          value="$52,000"
          icon={<DollarSign className="w-6 h-6 text-purple-600" />}
          trend={{ value: 10, isPositive: true }}
        />
        <StatItem
          label="Pending Maintenance"
          value="5"
          icon={<Wrench className="w-6 h-6 text-purple-600" />}
          trend={{ value: 2, isPositive: false }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Activity items will be mapped here */}
              <p className="text-muted-foreground">Loading activities...</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Payments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Payment items will be mapped here */}
              <p className="text-muted-foreground">Loading payments...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default Dashboard;
