const axios = require("axios").default;

// Load environment variables from .env file
require("dotenv").config();

const CONTENTFUL_SPACE_ID = process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID;
const CONTENTFUL_API_KEY = process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN;
const CONTENTFUL_API_URL = `https://cdn.contentful.com/spaces/${CONTENTFUL_SPACE_ID}`;

async function getBoardMembers() {
  try {
    const response = await axios.get(
      `${CONTENTFUL_API_URL}/entries?content_type=teamMembers&access_token=${CONTENTFUL_API_KEY}`
    );

    if (response.status === 200) {
      const boardMembers = response.data.items;
      // console.log(boardMembers);

      for (const member of boardMembers) {
        if (member.fields.photo && member.fields.photo.sys) {
          const assetId = member.fields.photo.sys.id;
          try {
            const imgResponse = await axios.get(
              `${CONTENTFUL_API_URL}/assets/${assetId}?access_token=${CONTENTFUL_API_KEY}`,
              { validateStatus: (status) => status >= 200 && status < 300 }
            );
            member.fields.imageURL = imgResponse.data.fields.file.url;
          } catch (assetError) {
            console.error("Error fetching asset:", assetError);
            throw assetError;
          }
        }
      }
      return boardMembers;
    } else {
      // Handle non-2xx status code here
      console.error("Non-2xx status code:", response.status);
      throw new Error(`Request failed with status code ${response.status}`);
    }
  } catch (error) {
    console.error("Error fetching board members:", error);
    throw error;
  }
}

module.exports = {
  getBoardMembers,
};
