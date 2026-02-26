import { motion } from 'framer-motion';
import { Mail, Briefcase, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/lib/auth-context';
import { activityFeed } from '@/lib/mock-data';
import DashboardLayout from '@/components/DashboardLayout';

const Profile = () => {
  const { user } = useAuth();

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold">Profile</h1>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-border bg-card shadow-card p-6">
          <div className="flex items-center gap-6 mb-6">
            <div className="relative">
              <div className="w-20 h-20 rounded-2xl gradient-primary flex items-center justify-center text-primary-foreground text-2xl font-bold">
                {user?.name?.charAt(0) || 'A'}
              </div>
              <button className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-card border border-border flex items-center justify-center hover:bg-muted transition-colors">
                <Camera className="w-3.5 h-3.5 text-muted-foreground" />
              </button>
            </div>
            <div>
              <h2 className="text-xl font-bold">{user?.name}</h2>
              <p className="text-muted-foreground">{user?.role}</p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground mb-1.5 block">Full Name</label>
              <Input defaultValue={user?.name} className="rounded-xl" />
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground mb-1.5 block">Email</label>
              <Input defaultValue={user?.email} className="rounded-xl" />
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground mb-1.5 block">Role</label>
              <Input defaultValue={user?.role} className="rounded-xl" />
            </div>
          </div>

          <div className="mt-6 flex gap-2">
            <Button className="gradient-primary text-primary-foreground rounded-xl">Save Changes</Button>
            <Button variant="outline" className="rounded-xl">Cancel</Button>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="rounded-2xl border border-border bg-card shadow-card p-6">
          <h3 className="font-semibold mb-4">Activity History</h3>
          <div className="space-y-4">
            {activityFeed.map(a => (
              <div key={a.id} className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-primary-foreground text-xs font-semibold shrink-0">
                  {a.user.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm"><span className="font-medium">{a.user.name}</span> {a.action} <span className="font-medium">{a.target}</span></p>
                  <span className="text-xs text-muted-foreground">{a.time}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default Profile;
