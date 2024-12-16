import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import { authService } from '@/lib/services/authService';
import type { User } from '@/types';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const AdminSettings: React.FC = () => {
  const { user: currentUser } = useSelector((state: RootState) => state.auth);
  const [users, setUsers] = React.useState<User[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);
  const [selectedUser, setSelectedUser] = React.useState<string | null>(null);
  const [selectedRole, setSelectedRole] = React.useState<User['role']>('tenant');

  React.useEffect(() => {
    const fetchUsers = async () => {
      try {
        const fetchedUsers = await authService.getAllUsers();
        setUsers(fetchedUsers.filter((u: User) => u.id !== currentUser?.id));
      } catch (err) {
        setError('Failed to fetch users');
        console.error('Error fetching users:', err);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser?.role === 'admin') {
      fetchUsers();
    }
  }, [currentUser]);

  const handleRoleUpdate = async () => {
    if (!selectedUser || !selectedRole) return;

    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      await authService.updateUserRole(selectedUser, selectedRole);
      setUsers(users.map(user => 
        user.id === selectedUser 
          ? { ...user, role: selectedRole }
          : user
      ));
      setSuccess('User role updated successfully');
      setSelectedUser(null);
    } catch (err) {
      setError('Failed to update user role');
      console.error('Role update error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (currentUser?.role !== 'admin') {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Management</CardTitle>
        <CardDescription>
          Manage user roles and permissions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* User Search */}
          <div className="space-y-2">
            <Label>Search Users</Label>
            <Input
              type="text"
              placeholder="Search by name or email"
              onChange={(e) => {
                const value = e.target.value.toLowerCase();
                setUsers(prevUsers => 
                  prevUsers.filter(user => 
                    user.name.toLowerCase().includes(value) ||
                    user.email.toLowerCase().includes(value)
                  )
                );
              }}
            />
          </div>

          {/* User List */}
          <div className="space-y-4">
            <Label>Users</Label>
            {loading ? (
              <div className="text-sm text-muted-foreground">Loading users...</div>
            ) : users.length === 0 ? (
              <div className="text-sm text-muted-foreground">No users found</div>
            ) : (
              <div className="space-y-2">
                {users.map(user => (
                  <div
                    key={user.id}
                    className={`p-4 rounded-lg border ${
                      selectedUser === user.id ? 'border-primary' : 'border-border'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {user.email}
                        </div>
                        <div className="text-sm font-medium text-primary">
                          {user.role.replace('_', ' ').toUpperCase()}
                        </div>
                      </div>
                      <Button
                        variant={selectedUser === user.id ? "default" : "outline"}
                        onClick={() => {
                          setSelectedUser(user.id);
                          setSelectedRole(user.role);
                        }}
                      >
                        {selectedUser === user.id ? 'Selected' : 'Select'}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Role Selection */}
          {selectedUser && (
            <div className="space-y-4">
              <div>
                <Label>Role</Label>
                <select
                  className="w-full h-10 px-3 py-2 text-sm rounded-md border border-input bg-background"
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value as User['role'])}
                >
                  <option value="tenant">Tenant</option>
                  <option value="property_manager">Property Manager</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <Button
                className="w-full"
                onClick={handleRoleUpdate}
                disabled={loading}
              >
                {loading ? 'Updating...' : 'Update Role'}
              </Button>
            </div>
          )}

          {error && (
            <div className="text-sm text-destructive" role="alert">
              {error}
            </div>
          )}

          {success && (
            <div className="text-sm text-green-600 dark:text-green-400" role="alert">
              {success}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminSettings;
