import { useState, useEffect } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/integrations/supabase/client';
import DashboardLayout from '@/components/DashboardLayout';
import { toast } from 'sonner';
import { useSearchParams } from 'react-router-dom';

interface Task {
  id: string;
  title: string;
  description: string;
  project_id: string;
  assigned_to: string | null;
  status: string;
  due_date: string | null;
  created_by: string;
}

interface Project { id: string; name: string; }
interface Profile { user_id: string; name: string; }

const statusColors: Record<string, string> = {
  'todo': 'bg-muted-foreground/20 text-muted-foreground',
  'in-progress': 'bg-accent/10 text-accent',
  'done': 'bg-primary/10 text-primary',
};

const Tasks = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const projectFilter = searchParams.get('project');

  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [filter, setFilter] = useState<string>('all');

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [projectId, setProjectId] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [dueDate, setDueDate] = useState('');

  const fetchData = async () => {
    const [{ data: taskData }, { data: projectData }, { data: profileData }] = await Promise.all([
      supabase.from('tasks').select('*').order('created_at', { ascending: false }),
      supabase.from('projects').select('id, name'),
      supabase.from('profiles').select('user_id, name'),
    ]);
    if (taskData) setTasks(taskData as Task[]);
    if (projectData) setProjects(projectData as Project[]);
    if (profileData) setProfiles(profileData as Profile[]);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();

    const channel = supabase
      .channel('tasks-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tasks' }, () => {
        fetchData();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  useEffect(() => {
    if (projectFilter) setProjectId(projectFilter);
  }, [projectFilter]);

  const filteredTasks = tasks.filter(t => {
    if (projectFilter && t.project_id !== projectFilter) return false;
    if (filter !== 'all' && t.status !== filter) return false;
    return true;
  });

  const getProfileName = (userId: string | null) => {
    if (!userId) return 'Unassigned';
    return profiles.find(p => p.user_id === userId)?.name || 'Unknown';
  };

  const getProjectName = (projectId: string) => {
    return projects.find(p => p.id === projectId)?.name || 'Unknown';
  };

  const openCreate = () => {
    setTitle(''); setDescription(''); setAssignedTo(''); setDueDate('');
    if (projectFilter) setProjectId(projectFilter);
    setDialogOpen(true);
  };

  const handleCreate = async () => {
    if (!title.trim() || !projectId) { toast.error('Title and project are required'); return; }
    const { error } = await supabase.from('tasks').insert({
      title, description, project_id: projectId,
      assigned_to: assignedTo || null,
      due_date: dueDate || null,
      created_by: user!.id,
    });
    if (error) { toast.error(error.message); return; }

    // Send notification if assigned
    if (assignedTo && assignedTo !== user!.id) {
      await supabase.from('notifications').insert({
        user_id: assignedTo,
        message: `You were assigned to task "${title}"`,
        type: 'assignment',
      });
    }

    toast.success('Task created');
    setDialogOpen(false);
    fetchData();
  };

  const updateStatus = async (taskId: string, newStatus: string, taskTitle: string) => {
    const { error } = await supabase.from('tasks').update({ status: newStatus }).eq('id', taskId);
    if (error) { toast.error(error.message); return; }

    // Notify about status change
    const task = tasks.find(t => t.id === taskId);
    if (task?.assigned_to && task.assigned_to !== user!.id) {
      await supabase.from('notifications').insert({
        user_id: task.assigned_to,
        message: `Task "${taskTitle}" status changed to ${newStatus}`,
        type: 'status',
      });
    }
  };

  const deleteTask = async (id: string) => {
    if (!confirm('Delete this task?')) return;
    const { error } = await supabase.from('tasks').delete().eq('id', id);
    if (error) { toast.error(error.message); return; }
    toast.success('Task deleted');
  };

  const currentProjectName = projectFilter ? getProjectName(projectFilter) : null;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold">Tasks {currentProjectName ? `— ${currentProjectName}` : ''}</h1>
            <p className="text-muted-foreground">Manage tasks{currentProjectName ? ` in ${currentProjectName}` : ' across all projects'}</p>
          </div>
          <Button onClick={openCreate} className="bg-primary text-primary-foreground rounded-lg">
            <Plus className="w-4 h-4 mr-1" /> New Task
          </Button>
        </div>

        <div className="flex gap-2 flex-wrap">
          {['all', 'todo', 'in-progress', 'done'].map(s => (
            <button key={s} onClick={() => setFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${filter === s ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}>
              {s === 'all' ? 'All' : s === 'in-progress' ? 'In Progress' : s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="text-muted-foreground">Loading...</p>
        ) : filteredTasks.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p>No tasks found.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {filteredTasks.map(t => (
              <div key={t.id} className="flex items-center gap-4 p-4 rounded-xl border border-border bg-card">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h4 className={`font-medium text-sm ${t.status === 'done' ? 'line-through text-muted-foreground' : ''}`}>{t.title}</h4>
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${statusColors[t.status] || ''}`}>{t.status}</span>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{t.description}</p>
                  <div className="flex gap-3 mt-1 text-xs text-muted-foreground">
                    <span>{getProjectName(t.project_id)}</span>
                    <span>→ {getProfileName(t.assigned_to)}</span>
                    {t.due_date && <span>Due: {t.due_date}</span>}
                  </div>
                </div>

                <Select value={t.status} onValueChange={(v) => updateStatus(t.id, v, t.title)}>
                  <SelectTrigger className="w-32 h-8 text-xs rounded-lg">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todo">To Do</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="done">Done</SelectItem>
                  </SelectContent>
                </Select>

                {t.created_by === user?.id && (
                  <Button variant="ghost" size="icon" className="w-8 h-8 text-destructive" onClick={() => deleteTask(t.id)}>
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent>
            <DialogHeader><DialogTitle>New Task</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1.5 block">Title</label>
                <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="Task title" className="rounded-lg" />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Description</label>
                <Textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Description" className="rounded-lg" rows={2} />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Project</label>
                <Select value={projectId} onValueChange={setProjectId}>
                  <SelectTrigger className="rounded-lg"><SelectValue placeholder="Select project" /></SelectTrigger>
                  <SelectContent>
                    {projects.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Assign To</label>
                <Select value={assignedTo} onValueChange={setAssignedTo}>
                  <SelectTrigger className="rounded-lg"><SelectValue placeholder="Select user" /></SelectTrigger>
                  <SelectContent>
                    {profiles.map(p => <SelectItem key={p.user_id} value={p.user_id}>{p.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Due Date</label>
                <Input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} className="rounded-lg" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleCreate} className="bg-primary text-primary-foreground">Create</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default Tasks;
