import { motion } from 'framer-motion';
import { Moon, Sun, Bell, Shield, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTheme } from '@/lib/theme-context';
import DashboardLayout from '@/components/DashboardLayout';

const Settings = () => {
  const { isDark, toggle } = useTheme();

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold">Settings</h1>

        {/* Theme */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-border bg-card shadow-card p-6">
          <div className="flex items-center gap-3 mb-4">
            {isDark ? <Moon className="w-5 h-5 text-primary" /> : <Sun className="w-5 h-5 text-primary" />}
            <h3 className="font-semibold">Appearance</h3>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Dark Mode</p>
              <p className="text-xs text-muted-foreground">Toggle between light and dark theme</p>
            </div>
            <button onClick={toggle} className={`relative w-12 h-6 rounded-full transition-colors ${isDark ? 'bg-primary' : 'bg-muted'}`}>
              <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-card shadow-sm transition-transform ${isDark ? 'left-6' : 'left-0.5'}`} />
            </button>
          </div>
        </motion.div>

        {/* Password */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="rounded-2xl border border-border bg-card shadow-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-5 h-5 text-primary" />
            <h3 className="font-semibold">Security</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground mb-1.5 block">Current Password</label>
              <Input type="password" className="rounded-xl max-w-md" />
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground mb-1.5 block">New Password</label>
              <Input type="password" className="rounded-xl max-w-md" />
            </div>
            <Button className="gradient-primary text-primary-foreground rounded-xl">Update Password</Button>
          </div>
        </motion.div>

        {/* Notifications */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="rounded-2xl border border-border bg-card shadow-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <Bell className="w-5 h-5 text-primary" />
            <h3 className="font-semibold">Notifications</h3>
          </div>
          <div className="space-y-3">
            {['Task assignments', 'Task completions', 'Deadline reminders', 'Team updates'].map(item => (
              <div key={item} className="flex items-center justify-between py-2">
                <span className="text-sm">{item}</span>
                <button className="relative w-10 h-5 rounded-full bg-primary transition-colors">
                  <div className="absolute top-0.5 left-5 w-4 h-4 rounded-full bg-card shadow-sm" />
                </button>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Danger */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="rounded-2xl border border-destructive/20 bg-card shadow-card p-6">
          <div className="flex items-center gap-3 mb-2">
            <Trash2 className="w-5 h-5 text-destructive" />
            <h3 className="font-semibold text-destructive">Danger Zone</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-4">Permanently delete your account and all associated data.</p>
          <Button variant="destructive" className="rounded-xl">Delete Account</Button>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
