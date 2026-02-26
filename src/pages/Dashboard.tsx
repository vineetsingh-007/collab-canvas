import { motion } from 'framer-motion';
import { FolderKanban, CheckCircle2, Clock, Users, TrendingUp } from 'lucide-react';
import { projects, tasks, teamMembers, activityFeed } from '@/lib/mock-data';
import { useAuth } from '@/lib/auth-context';
import DashboardLayout from '@/components/DashboardLayout';

const stats = [
  { label: 'Total Projects', value: '4', icon: FolderKanban, color: 'gradient-primary' },
  { label: 'Tasks Completed', value: '17', icon: CheckCircle2, color: 'bg-secondary' },
  { label: 'Pending Tasks', value: '7', icon: Clock, color: 'bg-accent' },
  { label: 'Team Members', value: '5', icon: Users, color: 'gradient-primary' },
];

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Welcome back, {user?.name?.split(' ')[0]} 👋</h1>
          <p className="text-muted-foreground">Here's what's happening with your projects.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-5 rounded-2xl border border-border bg-card shadow-card hover:shadow-soft transition-all duration-300 hover:-translate-y-0.5"
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl ${s.color} flex items-center justify-center`}>
                  <s.icon className="w-5 h-5 text-primary-foreground" />
                </div>
                <TrendingUp className="w-4 h-4 text-secondary" />
              </div>
              <p className="text-2xl font-bold">{s.value}</p>
              <p className="text-sm text-muted-foreground">{s.label}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Task progress */}
          <div className="lg:col-span-2 rounded-2xl border border-border bg-card shadow-card p-6">
            <h3 className="font-semibold mb-4">Project Progress</h3>
            <div className="space-y-4">
              {projects.map(p => (
                <div key={p.id}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">{p.title}</span>
                    <span className="text-sm text-muted-foreground">{p.progress}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${p.progress}%` }}
                      transition={{ duration: 1, delay: 0.3 }}
                      className="h-full rounded-full gradient-primary"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Activity feed */}
          <div className="rounded-2xl border border-border bg-card shadow-card p-6">
            <h3 className="font-semibold mb-4">Recent Activity</h3>
            <div className="space-y-4">
              {activityFeed.map(a => (
                <div key={a.id} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-primary-foreground text-xs font-semibold shrink-0">
                    {a.user.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm">
                      <span className="font-medium">{a.user.name}</span>{' '}
                      <span className="text-muted-foreground">{a.action}</span>{' '}
                      <span className="font-medium">{a.target}</span>
                    </p>
                    <span className="text-xs text-muted-foreground">{a.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Upcoming deadlines */}
        <div className="rounded-2xl border border-border bg-card shadow-card p-6">
          <h3 className="font-semibold mb-4">Upcoming Deadlines</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {tasks.filter(t => t.status !== 'completed').slice(0, 4).map(t => (
              <div key={t.id} className="p-4 rounded-xl bg-muted/50 border border-border hover:shadow-card transition-all">
                <div className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium mb-2 ${
                  t.priority === 'high' ? 'bg-destructive/10 text-destructive' :
                  t.priority === 'medium' ? 'bg-accent/10 text-accent' : 'bg-secondary/10 text-secondary'
                }`}>
                  {t.priority}
                </div>
                <h4 className="font-medium text-sm mb-1 truncate">{t.title}</h4>
                <p className="text-xs text-muted-foreground">Due: {t.dueDate}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
