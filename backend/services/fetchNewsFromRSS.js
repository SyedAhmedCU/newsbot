const axios = require('axios');
const xml2js = require('xml2js');

const rssUrl= process.env.NEWS_RSS_FEED_URL

// Fetch and parse RSS feed
async function getRSSFeed() {
  const response = await axios.get(rssUrl);
  const parser = new xml2js.Parser();
  const feed = await parser.parseStringPromise(response.data);
  return feed;
}

// Extract top 10 news articles
function extractTopArticles(feed) {
  const items = feed.rss.channel[0].item.slice(0, 10);
  return items.map(item => ({
    title: item.title[0],
    description: item.description[0],
    link: item.link[0],
    pubDate: item.pubDate[0],
  }));
}

async function fetchNewsFromRSS(){
  const feed = await getRSSFeed();
  const articles = extractTopArticles(feed);
  console.log('Fetched news:', articles);
  return articles
}

module.exports = {
  getRSSFeed,
  extractTopArticles,
  fetchNewsFromRSS
};
