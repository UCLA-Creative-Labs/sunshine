import { ProjectAnnouncement } from '@/types/events';

interface ProjectAnnouncementCardProps {
  announcement: ProjectAnnouncement;
  compact?: boolean;
}

export default function ProjectAnnouncementCard({
  announcement,
  compact = false,
}: ProjectAnnouncementCardProps) {
  const priorityStyles = {
    low: 'bg-gray-50 border-gray-300 text-gray-800',
    normal: 'bg-blue-50 border-blue-300 text-blue-900',
    high: 'bg-orange-50 border-orange-300 text-orange-900',
    urgent: 'bg-red-50 border-red-300 text-red-900',
  };

  const priorityIcons = {
    low: '💬',
    normal: '📢',
    high: '⚡',
    urgent: '🚨',
  };

  const typeIcons = {
    update: '🔄',
    milestone: '🎉',
    recruitment: '👥',
    launch: '🚀',
    general: '📢',
  };

  const style = priorityStyles[announcement.priority as keyof typeof priorityStyles] || priorityStyles.normal;
  const icon = priorityIcons[announcement.priority as keyof typeof priorityIcons] || priorityIcons.normal;
  const typeIcon = announcement.announcement_type
    ? typeIcons[announcement.announcement_type as keyof typeof typeIcons]
    : null;

  if (compact) {
    const publishDate = new Date(announcement.publish_date);
    const monthDay = publishDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });

    return (
      <div className={`border-2 rounded-lg p-3 ${style} hover:shadow-md transition`}>
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-start gap-2 flex-1 min-w-0">
            <span className="text-lg">{icon}</span>
            <div className="flex-1 min-w-0">
              {announcement.is_pinned && (
                <span className="text-xs font-bold mr-2">📌 PINNED</span>
              )}
              <h4 className="font-bold text-sm">{announcement.title}</h4>
            </div>
          </div>
          <span className="text-xs font-semibold whitespace-nowrap">{monthDay}</span>
        </div>
        <p className="text-xs line-clamp-2 ml-7">{announcement.description}</p>
        {announcement.link_url && (
          <a
            href={announcement.link_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs underline mt-1.5 inline-block hover:opacity-80 font-medium ml-7"
          >
            {announcement.link_text || 'Learn more'} →
          </a>
        )}
      </div>
    );
  }

  return (
    <div className={`border-2 rounded-lg overflow-hidden ${style} hover:shadow-lg transition`}>
      {announcement.image_url && (
        <img
          src={announcement.image_url}
          alt={announcement.title}
          className="w-full h-48 object-cover"
        />
      )}

      <div className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 flex-1">
            <span className="text-2xl">{icon}</span>
            <div>
              {announcement.is_pinned && (
                <div className="text-xs font-bold mb-1">📌 PINNED</div>
              )}
              <h3 className="text-xl font-bold">{announcement.title}</h3>
            </div>
          </div>
          {announcement.announcement_type && (
            <span className="px-2 py-1 bg-white/50 rounded text-xs uppercase font-semibold whitespace-nowrap">
              {typeIcon} {announcement.announcement_type}
            </span>
          )}
        </div>

        <p className="text-sm leading-relaxed">{announcement.description}</p>

        {announcement.link_url && (
          <a
            href={announcement.link_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition font-medium text-sm"
          >
            {announcement.link_text || 'Learn more'} →
          </a>
        )}

        <div className="text-xs text-gray-600 pt-2 border-t border-current/20">
          Posted {new Date(announcement.publish_date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })}
        </div>
      </div>
    </div>
  );
}
