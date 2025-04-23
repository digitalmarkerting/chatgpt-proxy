const express = require('express');
const axios = require('axios');
const app = express();

// Render menggunakan port dari pemboleh ubah persekitaran
const port = process.env.PORT || 3000;

// Kunci API ChatGPT dari pemboleh ubah persekitaran (ditetapkan di Render)
const CHATGPT_API_KEY = process.env.CHATGPT_API_KEY;
const CHATGPT_URL = 'https://api.openai.com/v1/chat/completions';

// Benarkan parsing badan JSON
app.use(express.json());

// Benarkan CORS untuk permintaan dari interactivelink.co
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://interactivelink.co');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'POST, OPTIONS');
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});

// Endpoint untuk menghantar mesej ke ChatGPT
app.post('/chatgpt', async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      console.error('Error: Missing message in request body');
      return res.status(400).json({ error: 'Missing message' });
    }

    console.log('Received message:', message);

    const response = await axios.post(
      CHATGPT_URL,
      {
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: message }],
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${CHATGPT_API_KEY}`,
        },
      }
    );

    const reply = response.data.choices[0].message.content;
    console.log('ChatGPT reply:', reply);
    res.json({ status: 'success', reply });
  } catch (error) {
    console.error('Error:', error.message, error.response?.data);
    res.status(500).json({ error: error.message });
  }
});

// Mulakan pelayan
app.listen(port, () => {
  console.log(`Server running at port ${port}`);
});
