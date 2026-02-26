export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  members: User[];
  progress: number;
  dueDate: string;
  status: 'active' | 'completed' | 'on-hold';
  tasksCount: number;
  completedTasks: number;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  assignee: User;
  priority: 'low' | 'medium' | 'high';
  status: 'todo' | 'in-progress' | 'completed';
  dueDate: string;
  projectId: string;
  comments: number;
  attachments: number;
}

export interface Notification {
  id: string;
  type: 'assignment' | 'completion' | 'deadline' | 'mention';
  message: string;
  time: string;
  read: boolean;
}

export const currentUser: User = {
  id: '1',
  name: 'Alex Johnson',
  email: 'alex@collabsphere.io',
  avatar: '',
  role: 'Product Manager',
};

export const teamMembers: User[] = [
  currentUser,
  { id: '2', name: 'Sarah Chen', email: 'sarah@collabsphere.io', avatar: '', role: 'Designer' },
  { id: '3', name: 'Mike Rivera', email: 'mike@collabsphere.io', avatar: '', role: 'Developer' },
  { id: '4', name: 'Emily Park', email: 'emily@collabsphere.io', avatar: '', role: 'Developer' },
  { id: '5', name: 'James Wilson', email: 'james@collabsphere.io', avatar: '', role: 'QA Engineer' },
];

export const projects: Project[] = [
  { id: '1', title: 'CollabSphere Platform', description: 'Main product development for Q1 launch', members: teamMembers.slice(0, 4), progress: 72, dueDate: '2026-03-15', status: 'active', tasksCount: 24, completedTasks: 17 },
  { id: '2', title: 'Mobile App Redesign', description: 'Complete UI overhaul for iOS and Android apps', members: teamMembers.slice(1, 4), progress: 45, dueDate: '2026-04-01', status: 'active', tasksCount: 18, completedTasks: 8 },
  { id: '3', title: 'API Documentation', description: 'Write comprehensive API docs for developers', members: teamMembers.slice(2, 5), progress: 90, dueDate: '2026-03-01', status: 'active', tasksCount: 12, completedTasks: 11 },
  { id: '4', title: 'Marketing Website', description: 'New landing pages and brand refresh', members: teamMembers.slice(0, 3), progress: 30, dueDate: '2026-04-15', status: 'active', tasksCount: 15, completedTasks: 5 },
];

export const tasks: Task[] = [
  { id: '1', title: 'Design new dashboard layout', description: 'Create wireframes and high-fidelity mockups', assignee: teamMembers[1], priority: 'high', status: 'in-progress', dueDate: '2026-03-01', projectId: '1', comments: 5, attachments: 3 },
  { id: '2', title: 'Implement authentication flow', description: 'Set up JWT auth with refresh tokens', assignee: teamMembers[2], priority: 'high', status: 'completed', dueDate: '2026-02-28', projectId: '1', comments: 8, attachments: 1 },
  { id: '3', title: 'Write unit tests for API', description: 'Cover all endpoints with test cases', assignee: teamMembers[3], priority: 'medium', status: 'todo', dueDate: '2026-03-10', projectId: '1', comments: 2, attachments: 0 },
  { id: '4', title: 'Set up CI/CD pipeline', description: 'Configure GitHub Actions for auto deploy', assignee: teamMembers[2], priority: 'medium', status: 'in-progress', dueDate: '2026-03-05', projectId: '1', comments: 3, attachments: 2 },
  { id: '5', title: 'User onboarding flow', description: 'Create guided tour for new users', assignee: teamMembers[1], priority: 'low', status: 'todo', dueDate: '2026-03-20', projectId: '2', comments: 1, attachments: 0 },
  { id: '6', title: 'Performance optimization', description: 'Reduce bundle size and improve load times', assignee: teamMembers[3], priority: 'high', status: 'todo', dueDate: '2026-03-08', projectId: '1', comments: 4, attachments: 1 },
  { id: '7', title: 'Database schema migration', description: 'Migrate to new schema for v2', assignee: teamMembers[2], priority: 'high', status: 'in-progress', dueDate: '2026-03-03', projectId: '3', comments: 6, attachments: 2 },
  { id: '8', title: 'Mobile responsive fixes', description: 'Fix layout issues on smaller screens', assignee: teamMembers[1], priority: 'medium', status: 'todo', dueDate: '2026-03-12', projectId: '2', comments: 2, attachments: 4 },
];

export const notifications: Notification[] = [
  { id: '1', type: 'assignment', message: 'You were assigned to "Design new dashboard layout"', time: '5 min ago', read: false },
  { id: '2', type: 'completion', message: 'Sarah completed "Implement authentication flow"', time: '1 hour ago', read: false },
  { id: '3', type: 'deadline', message: 'Deadline approaching for "API Documentation"', time: '2 hours ago', read: true },
  { id: '4', type: 'mention', message: 'Mike mentioned you in a comment', time: '3 hours ago', read: true },
  { id: '5', type: 'completion', message: 'Emily completed "Write unit tests"', time: '5 hours ago', read: true },
];

export const activityFeed = [
  { id: '1', user: teamMembers[1], action: 'completed task', target: 'Auth Flow Design', time: '10 min ago' },
  { id: '2', user: teamMembers[2], action: 'created project', target: 'API v2.0', time: '30 min ago' },
  { id: '3', user: teamMembers[3], action: 'commented on', target: 'Performance Review', time: '1 hour ago' },
  { id: '4', user: teamMembers[0], action: 'assigned task to', target: 'Sarah Chen', time: '2 hours ago' },
  { id: '5', user: teamMembers[4], action: 'updated status of', target: 'QA Testing', time: '3 hours ago' },
];
