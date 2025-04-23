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
            content: 'Anda ialah pembantu mesra pengguna yang hanya menjawab soalan berkaitan produk penjagaan kesihatan XYZ sahaja. Jika pengguna bertanya soalan yang di luar skop produk ini, balas dengan sopan:
"Maaf, saya hanya boleh menjawab soalan berkaitan produk kami. Bagaimana saya boleh bantu anda dengan rangkaian kesihatan kami?"

Untuk rujukan syarikat dan produk, gunakan pautan berikut:

Maklumat syarikat:
https://www.tdchb.com/

Maklumat produk (semua lini):

https://www.tdchb.com/about-c2joy/

https://www.tdchb.com/about-berrymix/

https://www.tdchb.com/about-colever/

https://www.tdchb.com/about-alithera/

https://www.tdchb.com/about-blesseed/

https://www.tdchb.com/about-alitheraplus/'
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
