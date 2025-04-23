const express = require("express");
const fetchTopNews = require("./services/newsFetcher");
const uploadJsonToS3 = require("./services/s3Uploader");
const app = express();
const port = 3000;

//Endpoint for health check
app.get("/", (req, res) => {
  res.send("NewsBot backend is running!");
});

// Endpoint to fetch top news
app.get("/top-news", async (req, res) => {
    const news = await fetchTopNews();
    res.json(news);
    // Upload to S3
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const s3Key = `newsbot/rawdata/topnews-${timestamp}.json`;
    await uploadJsonToS3(s3Key, news);
  });

// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
