import { ActivityLogEntry } from '@/lib/supabase/activityService';
import { TaskPriority, TaskStatus } from '@/lib/types/database';

function toTitleCase(raw: string): string {
    const sentence = raw
        .replace(/[_-]+/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

    if (!sentence) {
        return 'Updated project activity';
    }

    return sentence[0].toUpperCase() + sentence.slice(1);
}

function getMetadataText(
    metadata: ActivityLogEntry['metadata'],
    keys: string[],
): string | null {
    if (!metadata) {
        return null;
    }

    for (const key of keys) {
        const value = metadata[key];
        if (typeof value === 'string' && value.trim()) {
            return value.trim();
        }
    }

    return null;
}

function getMetadataStringArray(
    metadata: ActivityLogEntry['metadata'],
    key: string,
): string[] {
    if (!metadata) {
        return [];
    }

    const raw = metadata[key];
    if (!Array.isArray(raw)) {
        return [];
    }

    return raw.filter(
        (value): value is string =>
            typeof value === 'string' && value.trim().length > 0,
    );
}

function getMetadataNumber(
    metadata: ActivityLogEntry['metadata'],
    keys: string[],
): number | null {
    if (!metadata) {
        return null;
    }

    for (const key of keys) {
        const value = metadata[key];
        if (typeof value === 'number' && Number.isFinite(value)) {
            return value;
        }
        if (
            typeof value === 'string' &&
            value.trim() &&
            !Number.isNaN(Number(value))
        ) {
            return Number(value);
        }
    }

    return null;
}

export function formatRelativeTime(timestamp: string): string {
    const parsed = new Date(timestamp);
    if (Number.isNaN(parsed.getTime())) {
        return '';
    }

    const elapsedMinutes = Math.floor((Date.now() - parsed.getTime()) / 60000);
    if (elapsedMinutes < 1) {
        return 'Just now';
    }
    if (elapsedMinutes < 60) {
        return `${elapsedMinutes}m ago`;
    }

    const elapsedHours = Math.floor(elapsedMinutes / 60);
    if (elapsedHours < 24) {
        return `${elapsedHours}h ago`;
    }

    const elapsedDays = Math.floor(elapsedHours / 24);
    if (elapsedDays < 7) {
        return `${elapsedDays}d ago`;
    }

    return new Intl.DateTimeFormat(undefined, {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
    }).format(parsed);
}

export function getActivityMessage(activity: ActivityLogEntry): string {
    const taskName = getMetadataText(activity.metadata, [
        'task_name',
        'task_title',
        'task',
        'title',
    ]);
    const eventTitle = getMetadataText(activity.metadata, [
        'event_title',
        'event_name',
    ]);
    const announcementTitle = getMetadataText(activity.metadata, [
        'announcement_title',
    ]);
    const assigneeSummary =
        getMetadataText(activity.metadata, ['assignee_summary']) ||
        getMetadataStringArray(activity.metadata, 'assignee_names').join(', ');
    const nextStatus = getMetadataText(activity.metadata, [
        'to_status',
        'status',
    ]);
    const issueNumber = getMetadataNumber(activity.metadata, [
        'github_issue_number',
    ]);

    switch (activity.action) {
        case 'created_task':
            return taskName ? `Created task "${taskName}"` : 'Created a task';
        case 'task_assigned':
            return taskName && assigneeSummary
                ? `Assigned "${taskName}" to ${assigneeSummary}`
                : taskName
                  ? `Assigned task "${taskName}"`
                  : 'Assigned a task';
        case 'updated_task_status':
            return taskName && nextStatus
                ? `Updated "${taskName}" to ${nextStatus}`
                : 'Updated a task status';
        case 'completed_task':
            return taskName
                ? `Completed task "${taskName}"`
                : 'Completed a task';
        case 'updated_task':
            return taskName ? `Updated task "${taskName}"` : 'Updated a task';
        case 'deleted_task':
            return taskName ? `Deleted task "${taskName}"` : 'Deleted a task';
        case 'created_task_from_github':
            return taskName && issueNumber
                ? `Created "${taskName}" from GitHub issue #${issueNumber}`
                : issueNumber
                  ? `Created a task from GitHub issue #${issueNumber}`
                  : 'Created a task from GitHub';
        case 'pushed_task_to_github':
            return taskName && issueNumber
                ? `Pushed "${taskName}" to GitHub issue #${issueNumber}`
                : taskName
                  ? `Pushed "${taskName}" to GitHub`
                  : 'Pushed a task to GitHub';
        case 'task_closed':
            return taskName
                ? `Closed task "${taskName}"`
                : 'Closed a task';
        case 'created_event':
            return eventTitle
                ? `Added event "${eventTitle}"`
                : 'Added a project event';
        case 'created_announcement':
            return announcementTitle
                ? `Posted announcement "${announcementTitle}"`
                : 'Posted a project announcement';
        default: {
            const bestLabel = taskName || eventTitle || announcementTitle;
            const base = toTitleCase(activity.action);
            return bestLabel ? `${base}: "${bestLabel}"` : base;
        }
    }
}

export function getActivityComment(
    metadata: ActivityLogEntry['metadata'],
): string | null {
    return getMetadataText(metadata, ['comment', 'note', 'description', 'message']);
}

export const TASK_PRIORITY_STYLES: Record<TaskPriority, string> = {
    low: 'rounded-full bg-[#E5F3FF] px-3 py-1 text-xs font-medium text-[#2563EB]',
    medium: 'rounded-full bg-[#FFF4DD] px-3 py-1 text-xs font-medium text-[#C47A00]',
    high: 'rounded-full bg-[#FFE3E3] px-3 py-1 text-xs font-medium text-[#E1225C]',
    urgent: 'rounded-full bg-[#FFD3DB] px-3 py-1 text-xs font-medium text-[#B10032]',
};

export const TASK_STATUS_STYLES: Record<
    TaskStatus,
    { label: string; className: string }
> = {
    todo: {
        label: 'Todo',
        className:
            'rounded-full bg-[#ECEFF3] px-3 py-1 text-xs font-medium text-[#4B5563]',
    },
    in_progress: {
        label: 'In Progress',
        className:
            'rounded-full bg-[#E2F7E6] px-3 py-1 text-xs font-medium text-[#1F7A3D]',
    },
    in_review: {
        label: 'In Review',
        className:
            'rounded-full bg-[#FFF2DC] px-3 py-1 text-xs font-medium text-[#C47A00]',
    },
    done: {
        label: 'Done',
        className:
            'rounded-full bg-[#ECE3FF] px-3 py-1 text-xs font-medium text-[#5B21B6]',
    },
};

export function formatPriorityLabel(priority: TaskPriority): string {
    return priority.charAt(0).toUpperCase() + priority.slice(1);
}
