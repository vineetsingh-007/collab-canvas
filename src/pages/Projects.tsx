import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/integrations/supabase/client';
import DashboardLayout from '@/components/DashboardLayout';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface Project {
  id: string;
  name: string;
  description: string;
  created_by: string;
  created_at: string;
}

const Projects = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Project | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const fetchProjects = async () => {
    const { data } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
    if (data) setProjects(data as Project[]);
    setLoading(false);
  };

  useEffect(() => { fetchProjects(); }, []);

  const openCreate = () => { setEditing(null); setName(''); setDescription(''); setDialogOpen(true); };
  const openEdit = (p: Project) => { setEditing(p); setName(p.name); setDescription(p.description); setDialogOpen(true); };

  const handleSave = async () => {
    if (!name.trim()) { toast.error('Project name is required'); return; }
    if (editing) {
      const { error } = await supabase.from('projects').update({ name, description }).eq('id', editing.id);
      if (error) { toast.error(error.message); return; }
      toast.success('Project updated');
    } else {
      const { error } = await supabase.from('projects').insert({ name, description, created_by: user!.id });
      if (error) { toast.error(error.message); return; }
      toast.success('Project created');
    }
    setDialogOpen(false);
    fetchProjects();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this project and all its tasks?')) return;
    const { error } = await supabase.from('projects').delete().eq('id', id);
    if (error) { toast.error(error.message); return; }
    toast.success('Project deleted');
    fetchProjects();
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Projects</h1>
            <p className="text-muted-foreground">Manage your projects</p>
          </div>
          <Button onClick={openCreate} className="bg-primary text-primary-foreground rounded-lg">
            <Plus className="w-4 h-4 mr-1" /> New Project
          </Button>
        </div>

        {loading ? (
          <p className="text-muted-foreground">Loading...</p>
        ) : projects.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p>No projects yet. Create your first project to get started.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map(p => (
              <div key={p.id} className="p-5 rounded-xl border border-border bg-card hover:shadow-sm transition-shadow cursor-pointer" onClick={() => navigate(`/tasks?project=${p.id}`)}>
                <div className="flex items-start justify-between mb-2">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                    {p.name.charAt(0)}
                  </div>
                  {p.created_by === user?.id && (
                    <div className="flex gap-1" onClick={e => e.stopPropagation()}>
                      <Button variant="ghost" size="icon" className="w-8 h-8" onClick={() => openEdit(p)}><Pencil className="w-3.5 h-3.5" /></Button>
                      <Button variant="ghost" size="icon" className="w-8 h-8 text-destructive" onClick={() => handleDelete(p.id)}><Trash2 className="w-3.5 h-3.5" /></Button>
                    </div>
                  )}
                </div>
                <h3 className="font-semibold mb-1">{p.name}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2">{p.description || 'No description'}</p>
                <p className="text-xs text-muted-foreground mt-3">{new Date(p.created_at).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        )}

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editing ? 'Edit Project' : 'New Project'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1.5 block">Name</label>
                <Input value={name} onChange={e => setName(e.target.value)} placeholder="Project name" className="rounded-lg" />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Description</label>
                <Textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Project description" className="rounded-lg" rows={3} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleSave} className="bg-primary text-primary-foreground">{editing ? 'Update' : 'Create'}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default Projects;
