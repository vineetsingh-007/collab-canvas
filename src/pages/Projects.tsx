import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Filter, MoreHorizontal, Calendar, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { projects, tasks, type Task } from '@/lib/mock-data';
import DashboardLayout from '@/components/DashboardLayout';

type View = 'grid' | 'kanban';

const Projects = () => {
  const [view, setView] = useState<View>('grid');
  const [selectedProject, setSelectedProject] = useState<string | null>(null);

  const kanbanProject = selectedProject || projects[0].id;
  const projectTasks = tasks.filter(t => t.projectId === kanbanProject);
  const columns: { status: Task['status']; label: string; color: string }[] = [
    { status: 'todo', label: 'To Do', color: 'bg-muted-foreground' },
    { status: 'in-progress', label: 'In Progress', color: 'bg-accent' },
    { status: 'completed', label: 'Completed', color: 'bg-secondary' },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold">Projects</h1>
            <p className="text-muted-foreground">Manage and track all your team projects.</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search projects..." className="pl-10 w-60 rounded-xl bg-muted/50" />
            </div>
            <Button variant="outline" size="icon" className="rounded-xl"><Filter className="w-4 h-4" /></Button>
            <div className="flex rounded-xl border border-border overflow-hidden">
              <button onClick={() => setView('grid')} className={`px-3 py-1.5 text-sm ${view === 'grid' ? 'bg-primary text-primary-foreground' : 'bg-card text-muted-foreground'}`}>Grid</button>
              <button onClick={() => setView('kanban')} className={`px-3 py-1.5 text-sm ${view === 'kanban' ? 'bg-primary text-primary-foreground' : 'bg-card text-muted-foreground'}`}>Kanban</button>
            </div>
            <Button className="gradient-primary text-primary-foreground rounded-xl"><Plus className="w-4 h-4 mr-1" /> New Project</Button>
          </div>
        </div>

        {view === 'grid' ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                onClick={() => { setSelectedProject(p.id); setView('kanban'); }}
                className="cursor-pointer group p-5 rounded-2xl border border-border bg-card shadow-card hover:shadow-soft transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
                    {p.title.charAt(0)}
                  </div>
                  <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity"><MoreHorizontal className="w-4 h-4" /></Button>
                </div>
                <h3 className="font-semibold mb-1">{p.title}</h3>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{p.description}</p>

                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Calendar className="w-3.5 h-3.5" /> {p.dueDate}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Users className="w-3.5 h-3.5" /> {p.members.length}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                    <div className="h-full rounded-full gradient-primary" style={{ width: `${p.progress}%` }} />
                  </div>
                  <span className="text-xs font-medium text-muted-foreground">{p.progress}%</span>
                </div>

                <div className="flex -space-x-2 mt-4">
                  {p.members.slice(0, 3).map(m => (
                    <div key={m.id} className="w-7 h-7 rounded-full gradient-primary border-2 border-card flex items-center justify-center text-primary-foreground text-[10px] font-semibold">
                      {m.name.charAt(0)}
                    </div>
                  ))}
                  {p.members.length > 3 && (
                    <div className="w-7 h-7 rounded-full bg-muted border-2 border-card flex items-center justify-center text-[10px] font-medium text-muted-foreground">
                      +{p.members.length - 3}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div>
            <div className="flex gap-2 mb-4 overflow-x-auto">
              {projects.map(p => (
                <button key={p.id} onClick={() => setSelectedProject(p.id)}
                  className={`px-4 py-1.5 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${kanbanProject === p.id ? 'gradient-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}>
                  {p.title}
                </button>
              ))}
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              {columns.map(col => (
                <div key={col.status} className="rounded-2xl bg-muted/30 border border-border p-4">
                  <div className="flex items-center gap-2 mb-4">
                    <div className={`w-2.5 h-2.5 rounded-full ${col.color}`} />
                    <h4 className="font-semibold text-sm">{col.label}</h4>
                    <span className="text-xs text-muted-foreground ml-auto">{projectTasks.filter(t => t.status === col.status).length}</span>
                  </div>
                  <div className="space-y-3">
                    {projectTasks.filter(t => t.status === col.status).map(t => (
                      <motion.div key={t.id} layout className="p-4 rounded-xl bg-card border border-border shadow-card hover:shadow-soft transition-all cursor-pointer">
                        <div className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold mb-2 ${
                          t.priority === 'high' ? 'bg-destructive/10 text-destructive' :
                          t.priority === 'medium' ? 'bg-accent/10 text-accent' : 'bg-secondary/10 text-secondary'
                        }`}>{t.priority}</div>
                        <h5 className="font-medium text-sm mb-1">{t.title}</h5>
                        <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{t.description}</p>
                        <div className="flex items-center justify-between">
                          <div className="w-6 h-6 rounded-full gradient-primary flex items-center justify-center text-primary-foreground text-[9px] font-semibold">
                            {t.assignee.name.charAt(0)}
                          </div>
                          <span className="text-[10px] text-muted-foreground">{t.dueDate}</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Projects;
