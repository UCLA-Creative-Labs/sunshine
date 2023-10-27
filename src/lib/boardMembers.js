const axios = require('axios').default;

// Load environment variables from .env file
require('dotenv').config();

const CONTENTFUL_SPACE_ID = process.env.CONTENTFUL_SPACE_ID;
const CONTENTFUL_API_KEY = process.env.CONTENTFUL_ACCESS_TOKEN;
const CONTENTFUL_API_URL = `https://cdn.contentful.com/spaces/${CONTENTFUL_SPACE_ID}`;

async function getBoardMembers() {
  try {
    const response = await axios.get(
      `${CONTENTFUL_API_URL}/entries?content_type=teamMembers&access_token=${CONTENTFUL_API_KEY}`,
    );

    const boardMembers = response.data.items;

    for (const member of boardMembers) {
      if (member.fields.photo && member.fields.photo.sys) {
        const assetId = member.fields.photo.sys.id;
        try {
          const imgResponse = await axios.get(
            `${CONTENTFUL_API_URL}/assets/${assetId}?access_token=${CONTENTFUL_API_KEY}`,
          );
          member.fields.imageURL = imgResponse.data.fields.file.url;
        } catch (error) {
          console.error('Error fetching asset:', error);
          throw error;
        }
      }
    }
    return boardMembers;
  } catch (error) {
    console.error('Error fetching board members:', error);
    throw error;
  }
}

module.exports = {
  getBoardMembers,
};
