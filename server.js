const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());

// CORS configuration
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://interactivelink.co');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'POST, OPTIONS');
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});

// ChatGPT endpoint
app.post('/chatgpt', async (req, res) => {
  const { message } = req.body;

  // Validate request
  if (!message) {
    return res.status(400).json({ error: 'Missing message' });
  }

  // ChatGPT API configuration
  const CHATGPT_API_KEY = process.env.CHATGPT_API_KEY;
  const CHATGPT_API_URL = 'https://api.openai.com/v1/chat/completions';

  try {
    // Send request to ChatGPT with system prompt
    const response = await axios.post(
      CHATGPT_API_URL,
      {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: `You are a helpful assistant that only answers questions about C2Joy colostrum milk products, as detailed on https://adsham.wixsite.com/c2joy/khasiat-c2joy. C2Joy is a health drink combining bovine colostrum from New Zealand (0-6 hours post-calving, 300 mg IgG per sachet, 24.6% per 100g) and TruCal® natural calcium (600 mg per sachet, 99.9% similar to human bone composition). Benefits include boosting immunity, strengthening bones and joints, improving metabolism, reducing cholesterol and blood sugar, fighting viruses and bacteria, and supporting heart, liver, kidney, and gut health. It’s halal (JAKIM), approved by KKM, FDA-recognized, and patented by Glanbia Nutritionals (TruCal® D7) and MyIPO. Suitable for all ages, sugar-free for diabetics, priced at RM 120 per box (25 sachets). If a user asks something unrelated, reply politely: "I'm sorry, I can only answer questions about C2Joy colostrum milk products. How can I assist you with C2Joy?" For product images, refer to the website https://adsham.wixsite.com/c2joy/khasiat-c2joy.`
          },
          {
            role: 'user',
            content: message
          }
        ],
        max_tokens: 150
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${CHATGPT_API_KEY}`
        }
      }
    );

    // Extract reply from ChatGPT
    const reply = response.data.choices[0].message.content;

    // Send response
    res.json({ status: 'success', reply });
  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message);
    res.status(500).json({ error: 'Request failed with status code ' + (error.response ? error.response.status : 500) });
  }
});

// Start server
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Server running at port ${PORT}`);
});
