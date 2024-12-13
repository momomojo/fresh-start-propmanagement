import React from 'react';
import { Building2, Users, DollarSign, Wrench } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import StatItem from '../components/ui/Stats';
import Card from '../components/ui/Card';

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
          <h2 className="text-lg font-semibold mb-4">Recent Activities</h2>
          <div className="space-y-4">
            {/* Activity items will be mapped here */}
            <p className="text-gray-600 dark:text-gray-400">Loading activities...</p>
          </div>
        </Card>
        <Card>
          <h2 className="text-lg font-semibold mb-4">Upcoming Payments</h2>
          <div className="space-y-4">
            {/* Payment items will be mapped here */}
            <p className="text-gray-600 dark:text-gray-400">Loading payments...</p>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default Dashboard;