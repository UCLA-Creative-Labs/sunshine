const axios = require("axios");

// Load environment variables from .env file
require("dotenv").config();

const CONTENTFUL_SPACE_ID = process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID;
const CONTENTFUL_API_KEY = process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN;
const CONTENTFUL_API_URL = `https://cdn.contentful.com/spaces/${CONTENTFUL_SPACE_ID}`;

async function getEvents() {
  try {
    const response = await axios.get(
      `${CONTENTFUL_API_URL}/entries?content_type=event&access_token=${CONTENTFUL_API_KEY}`
    );
    return response.data.items;
  } catch (error) {
    console.error("Error fetching events:", error);
    throw error;
  }
}

module.exports = {
  getEvents,
};
