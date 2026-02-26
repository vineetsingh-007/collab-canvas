import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/lib/auth-context';
import DashboardLayout from '@/components/DashboardLayout';
import { toast } from 'sonner';

const Profile = () => {
  const { profile, updateProfile, updatePassword, logout } = useAuth();
  const [name, setName] = useState(profile?.name || '');
  const [newPassword, setNewPassword] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSaveName = async () => {
    if (!name.trim()) { toast.error('Name is required'); return; }
    setSaving(true);
    try {
      await updateProfile({ name });
      toast.success('Profile updated');
    } catch (err: any) {
      toast.error(err?.message || 'Failed to update');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (newPassword.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    try {
      await updatePassword(newPassword);
      toast.success('Password updated');
      setNewPassword('');
    } catch (err: any) {
      toast.error(err?.message || 'Failed to update password');
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-lg mx-auto space-y-6">
        <h1 className="text-2xl font-bold">Profile</h1>

        <div className="rounded-xl border border-border bg-card p-6 space-y-4">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xl font-bold">
              {profile?.name?.charAt(0) || '?'}
            </div>
            <div>
              <p className="font-semibold">{profile?.name}</p>
              <p className="text-sm text-muted-foreground">{profile?.email}</p>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-1.5 block">Name</label>
            <Input value={name} onChange={e => setName(e.target.value)} className="rounded-lg" />
          </div>
          <Button onClick={handleSaveName} disabled={saving} className="bg-primary text-primary-foreground rounded-lg">
            {saving ? 'Saving...' : 'Save Name'}
          </Button>
        </div>

        <div className="rounded-xl border border-border bg-card p-6 space-y-4">
          <h3 className="font-semibold">Change Password</h3>
          <div>
            <label className="text-sm font-medium mb-1.5 block">New Password</label>
            <Input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} className="rounded-lg" />
          </div>
          <Button onClick={handleChangePassword} className="bg-primary text-primary-foreground rounded-lg">Update Password</Button>
        </div>

        <Button variant="outline" className="w-full rounded-lg" onClick={logout}>Logout</Button>
      </div>
    </DashboardLayout>
  );
};

export default Profile;
