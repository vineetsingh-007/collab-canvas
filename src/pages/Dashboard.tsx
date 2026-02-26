import { useEffect, useState } from 'react';
import { FolderKanban, CheckSquare, Clock, Users } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/integrations/supabase/client';
import DashboardLayout from '@/components/DashboardLayout';

const Dashboard = () => {
  const { profile } = useAuth();
  const [stats, setStats] = useState({ projects: 0, done: 0, pending: 0, users: 0 });

  useEffect(() => {
    const load = async () => {
      const [{ count: projectCount }, { count: doneCount }, { count: pendingCount }, { count: userCount }] = await Promise.all([
        supabase.from('projects').select('*', { count: 'exact', head: true }),
        supabase.from('tasks').select('*', { count: 'exact', head: true }).eq('status', 'done'),
        supabase.from('tasks').select('*', { count: 'exact', head: true }).neq('status', 'done'),
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
      ]);
      setStats({ projects: projectCount || 0, done: doneCount || 0, pending: pendingCount || 0, users: userCount || 0 });
    };
    load();
  }, []);

  const cards = [
    { label: 'Projects', value: stats.projects, icon: FolderKanban, color: 'bg-primary/10 text-primary' },
    { label: 'Tasks Done', value: stats.done, icon: CheckSquare, color: 'bg-accent/10 text-accent' },
    { label: 'Pending Tasks', value: stats.pending, icon: Clock, color: 'bg-destructive/10 text-destructive' },
    { label: 'Team Members', value: stats.users, icon: Users, color: 'bg-secondary/10 text-secondary' },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Welcome back, {profile?.name?.split(' ')[0] || 'User'} 👋</h1>
          <p className="text-muted-foreground">Here's your workspace overview.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {cards.map(c => (
            <div key={c.label} className="p-5 rounded-xl border border-border bg-card">
              <div className={`w-10 h-10 rounded-lg ${c.color} flex items-center justify-center mb-3`}>
                <c.icon className="w-5 h-5" />
              </div>
              <p className="text-2xl font-bold">{c.value}</p>
              <p className="text-sm text-muted-foreground">{c.label}</p>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
