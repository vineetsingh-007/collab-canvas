import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, ArrowRight } from 'lucide-react';
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
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Projects</h1>
            <p className="text-muted-foreground">Manage your team's projects</p>
          </div>
          <Button onClick={openCreate} className="rounded-xl gradient-primary text-primary-foreground font-semibold shadow-soft hover:shadow-glow transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] h-11 px-5">
            <Plus className="w-4 h-4 mr-1.5" /> New Project
          </Button>
        </div>

        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1,2,3].map(i => (
              <div key={i} className="p-5 rounded-2xl border border-border/50 bg-card h-40 animate-pulse" />
            ))}
          </div>
        ) : projects.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border p-16 text-center">
            <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
              <Plus className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground text-lg font-medium">No projects yet</p>
            <p className="text-muted-foreground text-sm mt-1">Create your first project to get started.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map(p => (
              <div
                key={p.id}
                className="group p-5 rounded-2xl border border-border/50 bg-card shadow-card hover:shadow-card-hover transition-all duration-300 cursor-pointer hover:-translate-y-1"
                onClick={() => navigate(`/tasks?project=${p.id}`)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="w-11 h-11 rounded-xl gradient-primary flex items-center justify-center text-primary-foreground font-bold text-sm shadow-soft">
                    {p.name.charAt(0)}
                  </div>
                  {p.created_by === user?.id && (
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity" onClick={e => e.stopPropagation()}>
                      <Button variant="ghost" size="icon" className="w-8 h-8 rounded-lg hover:bg-muted" onClick={() => openEdit(p)}>
                        <Pencil className="w-3.5 h-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="w-8 h-8 rounded-lg text-destructive hover:bg-destructive/10" onClick={() => handleDelete(p.id)}>
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  )}
                </div>
                <h3 className="font-semibold mb-1 group-hover:text-primary transition-colors">{p.name}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2">{p.description || 'No description'}</p>
                <div className="flex items-center justify-between mt-4">
                  <p className="text-xs text-muted-foreground">{new Date(p.created_at).toLocaleDateString()}</p>
                  <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200" />
                </div>
              </div>
            ))}
          </div>
        )}

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="rounded-2xl">
            <DialogHeader>
              <DialogTitle>{editing ? 'Edit Project' : 'New Project'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1.5 block">Name</label>
                <Input value={name} onChange={e => setName(e.target.value)} placeholder="Project name" className="rounded-xl h-11 bg-muted/50 border-border/50" />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Description</label>
                <Textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Project description" className="rounded-xl bg-muted/50 border-border/50" rows={3} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)} className="rounded-xl">Cancel</Button>
              <Button onClick={handleSave} className="rounded-xl gradient-primary text-primary-foreground">{editing ? 'Update' : 'Create'}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default Projects;
