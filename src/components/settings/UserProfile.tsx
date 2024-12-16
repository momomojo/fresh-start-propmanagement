import { useState } from 'react';
import { User } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface UserProfileProps {
  user: User;
  onSave: (user: Partial<User>) => void;
}

export const UserProfile = ({ user, onSave }: UserProfileProps) => {
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Information</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, email: e.target.value }))
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Role</Label>
            <p className="text-sm text-muted-foreground capitalize">
              {user.role.replace('_', ' ')}
            </p>
          </div>
          <div className="space-y-2">
            <Label>Account Created</Label>
            <p className="text-sm text-muted-foreground">
              {new Date(user.created_at).toLocaleDateString()}
            </p>
          </div>
          <div className="pt-4">
            <Button type="submit">Save Changes</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
