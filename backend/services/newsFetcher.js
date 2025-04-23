require('dotenv').config();
const axios = require("axios");

const NEWS_API_URL = "https://newsapi.org/v2/top-headlines";
const API_KEY = process.env.NEWS_API_KEY;

const fetchTopNews = async () => {
  try {
    const response = await axios.get(NEWS_API_URL, {
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
