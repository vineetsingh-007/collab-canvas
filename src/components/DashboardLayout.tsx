import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, FolderKanban, CheckSquare, Settings, User, Bell, LogOut,
  ChevronLeft, ChevronRight, Search, Moon, Sun
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/lib/auth-context';
import { useTheme } from '@/lib/theme-context';
import { notifications } from '@/lib/mock-data';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: FolderKanban, label: 'Projects', path: '/projects' },
  { icon: CheckSquare, label: 'Tasks', path: '/tasks' },
  { icon: User, label: 'Profile', path: '/profile' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { isDark, toggle } = useTheme();
  const unread = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar */}
      <motion.aside
        animate={{ width: collapsed ? 72 : 256 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="fixed left-0 top-0 bottom-0 z-40 flex flex-col border-r border-border bg-card"
      >
        <div className="h-16 flex items-center justify-between px-4 border-b border-border">
          <AnimatePresence>
            {!collapsed && (
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-lg font-bold gradient-text whitespace-nowrap">
                CollabSphere
              </motion.span>
            )}
          </AnimatePresence>
          <Button variant="ghost" size="icon" onClick={() => setCollapsed(!collapsed)} className="shrink-0">
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </Button>
        </div>

        <nav className="flex-1 py-4 px-2 space-y-1">
          {navItems.map(item => {
            const active = location.pathname === item.path;
            return (
              <Link key={item.path} to={item.path}>
                <div className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${active ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}>
                  {active && <motion.div layoutId="sidebar-active" className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full gradient-primary" />}
                  <item.icon className="w-5 h-5 shrink-0" />
                  <AnimatePresence>
                    {!collapsed && (
                      <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-sm font-medium whitespace-nowrap">
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="p-2 border-t border-border">
          <button onClick={() => { logout(); navigate('/'); }} className="flex items-center gap-3 px-3 py-2.5 w-full rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
            <LogOut className="w-5 h-5 shrink-0" />
            {!collapsed && <span className="text-sm font-medium">Logout</span>}
          </button>
        </div>
      </motion.aside>

      {/* Main */}
      <div className="flex-1 flex flex-col" style={{ marginLeft: collapsed ? 72 : 256, transition: 'margin-left 0.3s ease-in-out' }}>
        {/* Top navbar */}
        <header className="h-16 flex items-center justify-between px-6 border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-30">
          <div className="flex items-center gap-4 flex-1 max-w-md">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search..." className="pl-10 h-10 rounded-xl bg-muted/50 border-transparent focus:border-primary" />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={toggle} className="rounded-xl">
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>

            <div className="relative">
              <Button variant="ghost" size="icon" className="rounded-xl" onClick={() => setShowNotifications(!showNotifications)}>
                <Bell className="w-4 h-4" />
                {unread > 0 && <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full gradient-primary" />}
              </Button>

              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 top-full mt-2 w-80 rounded-2xl border border-border bg-card shadow-soft p-4 z-50"
                  >
                    <h4 className="font-semibold mb-3">Notifications</h4>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {notifications.map(n => (
                        <div key={n.id} className={`p-3 rounded-xl text-sm ${n.read ? 'bg-transparent' : 'bg-primary/5'}`}>
                          <p className="text-foreground">{n.message}</p>
                          <span className="text-xs text-muted-foreground">{n.time}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="flex items-center gap-2 ml-2 pl-2 border-l border-border">
              <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-primary-foreground text-sm font-semibold">
                {user?.name?.charAt(0) || 'A'}
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6">
          <motion.div key={location.pathname} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
