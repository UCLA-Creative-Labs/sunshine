'use client';

import { Mulish } from 'next/font/google';
import ProjectDescription from './components/ProjectDescription';
import ProjectLeads from './components/ProjectLeads';
import MyTasks from './components/MyTasks';
import RecentActivity from './components/RecentActivity';
import QuickLinks from './components/QuickLinks';
import { Project, Task, Activity, QuickLink } from './types';

const mulish = Mulish({ weight: ['400', '700'], subsets: ['latin'] });

// Mock data for development - replace with real data fetching later
const mockProject: Project = {
  id: '1',
  name: 'Project Alpha',
  description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  leads: [
    {
      id: '1',
      name: 'John Doe',
      email: 'john.doe@ucla.edu',
      role: 'Project Lead',
    },
  ],
  members: [],
  status: 'active',
  createdAt: new Date(),
};

const mockTasks: Task[] = [
  {
    id: '67',
    name: 'Complete initial wireframes',
    priority: 'high',
    topic: 'Design',
    status: 'in-progress',
    assignee: {
      id: '1',
      name: 'Jane Smith',
      email: 'jane@ucla.edu',
      role: 'Member',
    },
    projectId: '1',
  },
];

const mockActivities: Activity[] = [
  {
    id: '1',
    type: 'task_completed',
    description: 'completed',
    actorName: 'John Doe',
    relatedTask: 'Setup repository',
    timestamp: new Date(),
  },
  {
    id: '2',
    type: 'task_added',
    description: 'has been added',
    actorName: 'Task: Review designs',
    timestamp: new Date(),
  },
  {
    id: '3',
    type: 'member_added',
    description: 'made as project lead',
    actorName: 'Jane Smith',
    timestamp: new Date(),
  },
  {
    id: '4',
    type: 'project_created',
    description: '',
    actorName: 'Project Created',
    timestamp: new Date(),
  },
];

const mockQuickLinks: QuickLink[] = [
  { name: 'GitHub', url: 'https://github.com', icon: '' },
  { name: 'Figma', url: 'https://figma.com', icon: '' },
  { name: 'Notion', url: 'https://notion.so', icon: '' },
];

export default function PortalDashboard() {
  return (
    <div className={mulish.className}>
      <h1 className="text-3xl font-bold mb-8 text-black">My Project</h1>

      <div className="grid grid-cols-3 gap-6">
        {/* Left column - Project info and tasks */}
        <div className="col-span-2 space-y-6">
          <ProjectDescription project={mockProject} />
          <ProjectLeads leads={mockProject.leads} />
          <MyTasks tasks={mockTasks} />
        </div>

        {/* Right column - Activity and quick links */}
        <div className="space-y-6">
          <RecentActivity activities={mockActivities} />
          <QuickLinks links={mockQuickLinks} />
        </div>
      </div>
    </div>
  );
}
