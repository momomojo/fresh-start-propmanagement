import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface AdminSettingsProps {
  onSave: (settings: {
    emailNotifications: boolean;
    maintenanceAlerts: boolean;
    paymentReminders: boolean;
  }) => void;
}

export const AdminSettings = ({ onSave }: AdminSettingsProps) => {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    maintenanceAlerts: true,
    paymentReminders: true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(settings);
  };

  const handleToggle = (setting: keyof typeof settings) => {
    setSettings((prev) => ({
      ...prev,
      [setting]: !prev[setting],
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <Label>Email Notifications</Label>
            <p className="text-sm text-muted-foreground">
              Receive email notifications for important updates
            </p>
          </div>
          <Button
            type="button"
            variant={settings.emailNotifications ? 'default' : 'outline'}
            onClick={() => handleToggle('emailNotifications')}
          >
            {settings.emailNotifications ? 'Enabled' : 'Disabled'}
          </Button>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <Label>Maintenance Alerts</Label>
            <p className="text-sm text-muted-foreground">
              Get notified about maintenance requests
            </p>
          </div>
          <Button
            type="button"
            variant={settings.maintenanceAlerts ? 'default' : 'outline'}
            onClick={() => handleToggle('maintenanceAlerts')}
          >
            {settings.maintenanceAlerts ? 'Enabled' : 'Disabled'}
          </Button>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <Label>Payment Reminders</Label>
            <p className="text-sm text-muted-foreground">
              Send automatic payment reminders to tenants
            </p>
          </div>
          <Button
            type="button"
            variant={settings.paymentReminders ? 'default' : 'outline'}
            onClick={() => handleToggle('paymentReminders')}
          >
            {settings.paymentReminders ? 'Enabled' : 'Disabled'}
          </Button>
        </div>
      </div>

      <Button type="submit">Save Settings</Button>
    </form>
  );
};
