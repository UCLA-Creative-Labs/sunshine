import { ProjectEvent } from '@/types/events';

interface ProjectEventCardProps {
  event: ProjectEvent;
  compact?: boolean;
}

export default function ProjectEventCard({ event, compact = false }: ProjectEventCardProps) {
  const eventDate = new Date(event.event_date);
  const isUpcoming = eventDate > new Date();

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (compact) {
    const monthDay = eventDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });

    return (
      <div className="border-l-4 border-blue-600 bg-blue-50 p-3 rounded-lg hover:bg-blue-100 transition">
        <div className="flex justify-between items-start gap-3">
          <div className="flex-1 min-w-0">
            <h4 className="font-bold text-sm text-gray-900 truncate">{event.title}</h4>
            {event.event_time_display && (
              <p className="text-xs text-gray-600 mt-1">{event.event_time_display}</p>
            )}
            {event.location && (
              <p className="text-xs text-gray-500 mt-0.5 truncate">📍 {event.location}</p>
            )}
          </div>
          <div className="flex flex-col items-end gap-2">
            <span className="text-xs font-semibold text-gray-700 whitespace-nowrap">{monthDay}</span>
            {event.rsvp_link && (
              <a
                href={event.rsvp_link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition whitespace-nowrap"
              >
                RSVP
              </a>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="border-2 border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition">
      {event.image_url && (
        <img
          src={event.image_url}
          alt={event.title}
          className="w-full h-48 object-cover"
        />
      )}

      <div className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-xl font-bold text-gray-900">{event.title}</h3>
          {event.event_type && (
            <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs uppercase font-semibold whitespace-nowrap">
              {event.event_type.replace('_', ' ')}
            </span>
          )}
        </div>

        {event.description && (
          <p className="text-gray-700 text-sm">{event.description}</p>
        )}

        <div className="space-y-2 text-sm">
          <div className="flex items-start gap-2">
            <span className="font-semibold text-gray-900">📅 When:</span>
            <span className="text-gray-700">
              {event.event_time_display || formatDate(eventDate)}
            </span>
          </div>

          {event.location && (
            <div className="flex items-start gap-2">
              <span className="font-semibold text-gray-900">📍 Where:</span>
              <span className="text-gray-700">
                {event.location}
                {event.location_type && (
                  <span className="text-gray-500 ml-1">({event.location_type.replace('_', ' ')})</span>
                )}
              </span>
            </div>
          )}

          {event.rsvp_required && (
            <div className="flex items-center gap-2 text-orange-600 font-medium">
              ⚠️ RSVP Required
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-2 pt-2">
          {event.rsvp_link && (
            <a
              href={event.rsvp_link}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition font-medium text-sm"
            >
              RSVP Now
            </a>
          )}
          {event.virtual_link && (
            <a
              href={event.virtual_link}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 border-2 border-black text-black rounded-md hover:bg-gray-100 transition font-medium text-sm"
            >
              Join Virtual Event
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
