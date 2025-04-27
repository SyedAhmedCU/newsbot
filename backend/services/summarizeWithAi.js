const axios = require('axios');

const API_KEY = process.env.GEMINI_API_KEY;
const MODEL = process.env.GEMINI_MODEL;
const URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`;
const PROMPT = `Summarize the following news article using bullet points in a professional tone, similar to a news report. Highlight only the key facts and developments. Avoid introductory phrases like 'Here's what happened' or 'In summary'. Just provide the bullet-point summary—clear, concise, and under 100 words total. :\n\n`

async function summarizeContent(content) {
  try {
    if(!content) return null;
    const response = await axios.post(
      URL,
      {
        contents: [
          {
            parts: [
                {
                    text: PROMPT + content
                }
            ]
          }
        ]
      }
    );

    const summary = response.data.candidates?.[0]?.content?.parts?.[0]?.text;
    return summary || null;
  } catch (error) { 
    console.error('Gemini summarization failed:', error.message);
    return null;
  }
}

async function summarizeWithAi(newsArray) {
  const summarizedNews = await Promise.all(
    newsArray.map(async (news) => {
      if (!news || !news.content || news.content.trim() === '') return null;

      const summary = await summarizeContent(news.content);

      if (!summary) return null; 

      const { content, ...rest } = news;
      return { ...rest, summary };
    })
  );

  return summarizedNews.filter(item => item !== null);
}

module.exports = summarizeWithAi;
