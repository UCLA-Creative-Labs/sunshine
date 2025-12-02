import { Mulish } from 'next/font/google';
import { Task } from '../types';

const mulish = Mulish({ weight: ['400', '700'], subsets: ['latin'] });

interface MyTasksProps {
  tasks: Task[];
}

export default function MyTasks({ tasks }: MyTasksProps) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-700';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700';
      case 'low':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in-progress':
        return 'bg-blue-100 text-blue-700';
      case 'completed':
        return 'bg-green-100 text-green-700';
      case 'todo':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <section className={`border border-black rounded-lg p-6 text-black ${mulish.className}`}>
      <h2 className="text-xl font-bold mb-4 text-black">My Tasks</h2>
      <div className="border border-gray-300 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-black">Name</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-black">Priority</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-black">Topic</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-black">Status</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-black">Assignee</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {tasks.map((task) => (
              <tr key={task.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm text-black">{task.name}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(task.priority)}`}>
                    {task.priority}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className="px-2 py-1 rounded bg-pink-100 text-pink-700 text-xs font-medium">
                    {task.topic}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(task.status)}`}>
                    {task.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
                      <span className="text-xs font-bold text-black">{task.assignee.name.charAt(0)}</span>
                    </div>
                    <span className="text-sm text-black">{task.assignee.name}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
