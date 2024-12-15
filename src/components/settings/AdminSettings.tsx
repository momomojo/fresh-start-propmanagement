import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../lib/store';
import { authService } from '../../lib/services/authService';
import type { User } from '../../types';
import Card from '../ui/Card';
import Table from '../ui/Table';

const AdminSettings: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const [users, setUsers] = React.useState<User[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await authService.getAllUsers();
        setUsers(data);
      } catch (error) {
        setError('Failed to load users');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleRoleChange = async (userId: string, newRole: User['role']) => {
    try {
      await authService.updateUserRole(userId, newRole);
      setUsers(users.map(u => 
        u.id === userId ? { ...u, role: newRole } : u
      ));
    } catch (error) {
      setError('Failed to update user role');
    }
  };

  const columns = [
    {
      key: 'user',
      title: 'User',
      render: (user: User) => (
        <div className="flex items-center">
          <img
            src={user.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}`}
            alt={user.name}
            className="w-8 h-8 rounded-full mr-3"
          />
          <div>
            <div className="font-medium text-gray-900 dark:text-white">{user.name}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">{user.email}</div>
          </div>
        </div>
      )
    },
    {
      key: 'role',
      title: 'Role',
      render: (user: User) => (
        <select
          value={user.role}
          onChange={(e) => handleRoleChange(user.id, e.target.value as User['role'])}
          disabled={user.id === user.id} // Can't change own role
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        >
          <option value="admin">Administrator</option>
          <option value="property_manager">Property Manager</option>
          <option value="tenant">Tenant</option>
        </select>
      )
    },
    {
      key: 'status',
      title: 'Status',
      render: (user: User) => (
        <span className={`px-2 py-1 text-sm rounded-full ${
          user.status === 'active'
            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
            : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
        }`}>
          {user.status}
        </span>
      )
    }
  ];

  if (user?.role !== 'admin') {
    return null;
  }

  return (
    <Card>
      <h2 className="text-xl font-semibold mb-6">User Management</h2>

      {error && (
        <div className="mb-4 rounded-md bg-red-50 p-4 text-sm text-red-600 dark:bg-red-900/50 dark:text-red-400">
          {error}
        </div>
      )}

      <Table
        data={users}
        columns={columns}
        isLoading={loading}
      />
    </Card>
  );
};

export default AdminSettings;
