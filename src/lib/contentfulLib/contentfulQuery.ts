import client from './contentfulClient';

/**
 * Fetches documents from Contentful matching a query.
 * A query object should contain a string property `content_type`.
 * @param query
 */
export async function getDocs(query: { content_type: string }) {
    const entries = await client.getEntries(query);
    return entries.items;
}

/**
 * Fetches documents from Contentful matching a Content Type.
 * @param contentType
 */
export async function getDocsByType(contentType: string) {
    return getDocs({ content_type: contentType });
}

/**
 * Fetches documents from Contentful matching a Content Type.
 * @param contentType
 * @param fields
 */
export async function getDocsByField(
    contentType: string,
    fields: { [key: string]: string | boolean }
) {
    const typeQuery = {
        content_type: contentType,
    };
    const fieldsQuery = Object.fromEntries(
        Object.entries(fields).map((pair) => {
            return [`fields.${pair[0]}`, pair[1]];
        })
    );
    const query = { ...typeQuery, ...fieldsQuery };

    return getDocs(query);
}
