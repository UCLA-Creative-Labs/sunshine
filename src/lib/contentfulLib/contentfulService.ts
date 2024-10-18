import { getDocsByField } from '@/lib/contentfulLib';

/**
 * Fetches events from Contentful
 * @param upcoming
 */
export async function getEvents(upcoming: boolean) {
    const contentType = 'events';
    const fields = {
        upcoming,
    };

    const upcomingEvents = await getDocsByField(contentType, fields);
}
