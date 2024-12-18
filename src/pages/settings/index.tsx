import { Outlet, useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import SecurityDashboard from './SecurityDashboard';

export default function Settings() {
  const navigate = useNavigate();

  const handleTabChange = (value: string) => {
    navigate(`/settings/${value}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Settings</h1>
      
      <Tabs defaultValue="security" className="space-y-6" onValueChange={handleTabChange}>
        <TabsList>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="security">
          <SecurityDashboard />
        </TabsContent>

        <TabsContent value="profile">
          <Card>Profile settings coming soon...</Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>Notification settings coming soon...</Card>
        </TabsContent>
      </Tabs>

      <Outlet />
    </div>
  );
}