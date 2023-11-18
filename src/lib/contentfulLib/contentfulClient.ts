import { createClient } from "contentful";

if (!process.env.SPACE_ID || !process.env.CDN_API_KEY)
    throw new ReferenceError('No Contentful Content Delivery API Environmental Variables set. Please set them as `SPACE_ID` and `CDN_API_KEY` in /.env.local');

const client = createClient({
    space: process.env.SPACE_ID,
    accessToken: process.env.CDN_API_KEY
});

export default client;