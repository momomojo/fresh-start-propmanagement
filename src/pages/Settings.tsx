import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SecurityDashboard from './SecurityDashboard';
import ProfileSettings from './settings/ProfileSettings';

export default function Settings() {
  const navigate = useNavigate();
  const location = useLocation();

  // Set default tab based on URL path
  useEffect(() => {
    if (location.pathname === '/settings') {
      navigate('/settings/security');
    }
  }, [location.pathname, navigate]);

  const handleTabChange = (value: string) => {
    navigate(`/settings/${value}`);
  };

  // Extract current tab from URL
  const currentTab = location.pathname.split('/').pop() || 'security';

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Settings</h1>
      
      <Tabs value={currentTab} className="space-y-6" onValueChange={handleTabChange}>
        <TabsList>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="security">
          <SecurityDashboard />
        </TabsContent>

        <TabsContent value="profile">
          <ProfileSettings />
        </TabsContent>

        <TabsContent value="notifications">
          <div className="bg-card p-6 rounded-lg">
            Notification settings coming soon...
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}