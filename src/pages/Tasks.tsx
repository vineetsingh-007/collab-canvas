import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Filter, MessageSquare, Paperclip, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { tasks } from '@/lib/mock-data';
import DashboardLayout from '@/components/DashboardLayout';

const Tasks = () => {
  const [filter, setFilter] = useState<string>('all');

  const filtered = filter === 'all' ? tasks : tasks.filter(t => t.status === filter);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold">Tasks</h1>
            <p className="text-muted-foreground">Manage and track all your tasks across projects.</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search tasks..." className="pl-10 w-60 rounded-xl bg-muted/50" />
            </div>
            <Button className="gradient-primary text-primary-foreground rounded-xl"><Plus className="w-4 h-4 mr-1" /> New Task</Button>
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto">
          {['all', 'todo', 'in-progress', 'completed'].map(s => (
            <button key={s} onClick={() => setFilter(s)}
              className={`px-4 py-1.5 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${filter === s ? 'gradient-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}>
              {s === 'all' ? 'All' : s === 'in-progress' ? 'In Progress' : s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {filtered.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center gap-4 p-4 rounded-2xl border border-border bg-card shadow-card hover:shadow-soft transition-all group"
            >
              <div className={`w-3 h-3 rounded-full shrink-0 ${
                t.status === 'completed' ? 'bg-secondary' :
                t.status === 'in-progress' ? 'bg-accent' : 'bg-muted-foreground/40'
              }`} />

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className={`font-medium text-sm ${t.status === 'completed' ? 'line-through text-muted-foreground' : ''}`}>{t.title}</h4>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                    t.priority === 'high' ? 'bg-destructive/10 text-destructive' :
                    t.priority === 'medium' ? 'bg-accent/10 text-accent' : 'bg-secondary/10 text-secondary'
                  }`}>{t.priority}</span>
                </div>
                <p className="text-xs text-muted-foreground truncate">{t.description}</p>
              </div>

              <div className="flex items-center gap-4 shrink-0">
                <div className="hidden sm:flex items-center gap-3 text-muted-foreground">
                  <span className="flex items-center gap-1 text-xs"><MessageSquare className="w-3.5 h-3.5" /> {t.comments}</span>
                  <span className="flex items-center gap-1 text-xs"><Paperclip className="w-3.5 h-3.5" /> {t.attachments}</span>
                  <span className="flex items-center gap-1 text-xs"><Calendar className="w-3.5 h-3.5" /> {t.dueDate}</span>
                </div>
                <div className="w-7 h-7 rounded-full gradient-primary flex items-center justify-center text-primary-foreground text-[10px] font-semibold">
                  {t.assignee.name.charAt(0)}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Tasks;
