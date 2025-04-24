require('dotenv').config();
const axios = require("axios");

const API_URL = process.env.NEWS_API_URL;
const API_KEY = process.env.NEWS_API_KEY;

const fetchTopNews = async () => {
  try {
    const response = await axios.get(API_URL, {
      params: {
        apiKey: API_KEY,
        country: "us",
        pageSize: 10,
      },
    });

    const articles = response.data.articles;
    console.log("Fetched news:", articles);
    return articles;
  } catch (error) {
    console.error("Error fetching news:", error);
    return [];
  }
};

module.exports = fetchTopNews;
