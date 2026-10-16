// framework/ai.js
const axios = require('axios');
require('dotenv').config(); // To load API key securely from .env

const OPENAI_KEY = process.env.OPENAI_API_KEY;

async function getGptReply(prompt) {
  try {
    const res = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 200,
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENAI_KEY}`,
          'Content-Type': 'application/json',
        }
      }
    );

    return res.data.choices[0]?.message?.content?.trim();
  } catch (e) {
    console.error('GPT API Error:', e?.response?.data || e.message);
    return "⚠️ AI is currently unavailable. Try again later.";
  }
}

module.exports = { getGptReply };
