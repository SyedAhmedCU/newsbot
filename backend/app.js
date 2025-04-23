const express = require("express");
const fetchTopNews = require("./services/newsFetcher");
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
    console.log(`test`)
  });

// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
