const express = require("express");
const uploadJsonToS3 = require("./services/s3Uploader");
const { scrapeNewsContent, } = require('./services/scrapeNewsContent');
const { fetchNewsFromRSS, } = require('./services/fetchNewsFromRSS');
const summarizeWithAi = require('./services/summarizeWithAi');
const FULL_NEWS_DATA_PREFIX = process.env.FULL_NEWS_DATA_PREFIX
const SUMMARIZED_NEWS_DATA_PREFIX = process.env.SUMMARIZED_NEWS_DATA_PREFIX
const PORT = process.env.PORT || 3000;

const app = express();

//Endpoint for health check
app.get("/", (req, res) => {
  res.send("NewsBot backend is running!");
});

app.get('/fetch-news', async (req, res) => {
  try {
    // Get current timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');

    // Fetch news from RSS feed
    const rssNewsData = await fetchNewsFromRSS();

    if (!rssNewsData || rssNewsData.length === 0) {
      return res.status(404).json({ message: 'No news data found in RSS feed.' });
    }

    // Scrape full content from article links
    const fullNewsData = await scrapeNewsContent(rssNewsData);

    if (!fullNewsData || fullNewsData.length === 0) {
      return res.status(500).json({ message: 'Failed to extract content from any news items.' });
    }

    // Generate s3Key and upload full news data to S3
    const s3KeyFullNews = `${FULL_NEWS_DATA_PREFIX + timestamp}.json`;
    await uploadJsonToS3(s3KeyFullNews, fullNewsData);

    // Summarize news content
    const summarizedNews = await summarizeWithAi(fullNewsData);
    
    if (!summarizedNews || summarizedNews.length === 0) {
      return res.status(500).json({ message: 'Failed to summarize news content.' });
    }

    // Generate s3Key and upload summarized news data to S3
    const s3KeySummarizedNews = `${SUMMARIZED_NEWS_DATA_PREFIX + timestamp}.json`;

    await uploadJsonToS3(s3KeySummarizedNews, summarizedNews);

    res.status(200).json({
      message: '✅ News fetched, summarized and saved successfully.',
      timestamp,
      s3KeySummarizedNews,
      count: summarizedNews.length,
      summarizedNews,
    });
  } catch (err) {
    console.error('❌ Error in /fetch-news:', err.message);
    res.status(500).json({ message: '❌ Failed to fetch or summarize news.', error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
