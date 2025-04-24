const axios = require('axios');
const cheerio = require('cheerio');

/**
 * Scrapes full news content from a given URL.
 * @param {string} url - News URL
 * @returns {Promise<string|null>} - Full text content or null if error
 */
async function getFullNews(url) {
  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    // Scraping logic specific to BBC layout
    const paragraphs = $('article p').map((_, el) => $(el).text()).get();
    return paragraphs.join('\n\n').replace(/\n+/g, ' ');
  } catch (err) {
    console.error(`Failed to scrape ${url}:`, err.message);
    return null;
  }
}

/**
 * Takes an array of news objects and appends full scraped content.
 * @param {Array<Object>} newsData - Array of news objects
 * @returns {Promise<Array<Object>>} - News items with `content` added
 */
async function scrapeNewsContent(newsData) {
  const results = await Promise.all(
    newsData.map(async (news) => {
      const content = await getFullNews(news.link);

      if (!content) return null; // skip if no content
      
      return {
        ...news,
        content,
      };
    })
  );

  return results;
}

module.exports = {
  scrapeNewsContent
};
