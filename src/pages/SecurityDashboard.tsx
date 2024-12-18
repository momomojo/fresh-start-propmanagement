import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Shield, Smartphone, History } from 'lucide-react';
import { securityService } from '@/lib/services/securityService';
import { socialAuthService } from '@/lib/services/socialAuthService';

interface DeviceInfo {
  deviceId: string;
  browser: string;
  os: string;
  lastLogin: string;
  ipAddress: string;
}

interface LoginHistoryItem {
  timestamp: string;
  success: boolean;
  ipAddress: string;
  deviceInfo: DeviceInfo;
}

export default function SecurityDashboard() {
  const { user } = useAuth();
  const [devices, setDevices] = useState<DeviceInfo[]>([]);
  const [loginHistory, setLoginHistory] = useState<LoginHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notifications, setNotifications] = useState(false);

  useEffect(() => {
    const fetchSecurityData = async () => {
      try {
        setIsLoading(true);
        const [devicesData, historyData, settings] = await Promise.all([
          securityService.getDevices(),
          securityService.getLoginHistory(),
          securityService.getSecuritySettings()
        ]);
        setDevices(devicesData);
        setLoginHistory(historyData);
        setNotifications(settings.loginNotifications);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load security data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSecurityData();
  }, []);

  const handleRemoveDevice = async (deviceId: string) => {
    try {
      await securityService.removeDevice(deviceId);
      setDevices(devices.filter(d => d.deviceId !== deviceId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove device');
    }
  };

  const handleToggleNotifications = async () => {
    try {
      await securityService.enableLoginNotifications(!notifications);
      setNotifications(!notifications);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update notifications');
    }
  };

  const handleLinkGoogle = async () => {
    try {
      await socialAuthService.linkGoogleAccount();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to link Google account');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <h1 className="text-3xl font-bold">Security Settings</h1>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Account Security
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Email</Label>
              <p className="text-sm text-gray-500">{user?.email}</p>
            </div>

            <div>
              <Label>Connected Accounts</Label>
              <div className="mt-2">
                <Button
                  variant="outline"
                  onClick={handleLinkGoogle}
                  className="w-full"
                >
                  Link Google Account
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Login Notifications</Label>
                <p className="text-sm text-gray-500">
                  Get notified about new sign-ins
                </p>
              </div>
              <Button
                variant={notifications ? "default" : "outline"}
                onClick={handleToggleNotifications}
              >
                {notifications ? 'Enabled' : 'Disabled'}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smartphone className="w-5 h-5" />
              Active Devices
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {devices.map((device) => (
                <div
                  key={device.deviceId}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                >
                  <div>
                    <p className="font-medium">{device.browser}</p>
                    <p className="text-sm text-gray-500">
                      {device.os} • Last active{' '}
                      {new Date(device.lastLogin).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-500">{device.ipAddress}</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRemoveDevice(device.deviceId)}
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <History className="w-5 h-5" />
              Login History
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {loginHistory.map((login, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                >
                  <div>
                    <p className="font-medium">
                      {login.success ? 'Successful login' : 'Failed attempt'}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(login.timestamp).toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-500">
                      {login.deviceInfo.browser} • {login.deviceInfo.os}
                    </p>
                    <p className="text-sm text-gray-500">{login.ipAddress}</p>
                  </div>
                  <div
                    className={`px-2 py-1 rounded text-sm ${
                      login.success
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                        : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                    }`}
                  >
                    {login.success ? 'Success' : 'Failed'}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}