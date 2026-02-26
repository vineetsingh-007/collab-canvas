import { motion } from 'framer-motion';
import { LayoutDashboard, Users, CheckCircle2, Bell, BarChart3, Shield } from 'lucide-react';

const features = [
  { icon: LayoutDashboard, title: 'Smart Dashboard', description: 'Get a bird\'s eye view of all your projects with real-time widgets and analytics.' },
  { icon: Users, title: 'Team Collaboration', description: 'Invite your team, assign tasks, and track progress together seamlessly.' },
  { icon: CheckCircle2, title: 'Kanban Boards', description: 'Organize tasks with drag-and-drop boards that adapt to your workflow.' },
  { icon: Bell, title: 'Smart Notifications', description: 'Stay in the loop with real-time alerts for deadlines and updates.' },
  { icon: BarChart3, title: 'Analytics & Reports', description: 'Track team productivity with beautiful charts and exportable reports.' },
  { icon: Shield, title: 'Enterprise Security', description: 'JWT authentication, role-based access, and data encryption by default.' },
];

const FeaturesSection = () => {
  return (
    <section className="py-24 bg-background" id="features">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Everything your team needs</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            A complete platform built for modern teams to plan, track, and ship products faster.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group p-6 rounded-2xl border border-border bg-card shadow-card hover:shadow-soft transition-all duration-300 hover:-translate-y-1"
            >
              <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center mb-4 group-hover:shadow-glow transition-shadow">
                <f.icon className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{f.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
