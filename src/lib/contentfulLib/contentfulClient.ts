import { createClient } from "contentful";

if (!process.env.NEXT_PUBLIC_SPACE_ID || !process.env.NEXT_PUBLIC_CDN_API_KEY)
    throw new ReferenceError('No Contentful Content Delivery API Environmental Variables set. Please set them as `SPACE_ID` and `CDN_API_KEY` in /.env.local');

const client = createClient({
    space: process.env.NEXT_PUBLIC_SPACE_ID,
    accessToken: process.env.NEXT_PUBLIC_CDN_API_KEY
});

export default client;