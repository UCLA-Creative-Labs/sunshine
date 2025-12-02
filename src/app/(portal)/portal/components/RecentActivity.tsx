import { Mulish } from 'next/font/google';
import { Activity } from '../types';

const mulish = Mulish({ weight: ['400', '700'], subsets: ['latin'] });

interface RecentActivityProps {
  activities: Activity[];
}

export default function RecentActivity({ activities }: RecentActivityProps) {
  return (
    <section className={`border border-black rounded-lg p-6 text-black ${mulish.className}`}>
      <h2 className="text-xl font-bold mb-4 text-black">Recent Activity</h2>
      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start space-x-3 relative">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-black">
              {activity.actorName.charAt(0)}
            </div>
            <div className="flex-1">
              <p className="text-sm text-black">
                <span className="font-semibold text-black">{activity.actorName}</span>{' '}
                {activity.description}
                {activity.relatedTask && (
                  <span className="font-semibold text-black"> {activity.relatedTask}</span>
                )}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
