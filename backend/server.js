// backend/server.js
require('dotenv').config();
const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const CHATGPT_MODEL = 'gpt-3.5-turbo';

app.post('/api/chat', async (req, res) => {
  const { mensagem } = req.body;

  if (!OPENROUTER_API_KEY) {
    return res.status(500).json({ error: 'Chave da API do OpenRouter não configurada.' });
  }

  if (!mensagem) {
    return res.status(400).json({ error: 'A mensagem é obrigatória.' });
  }

  try {
    const response = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: CHATGPT_MODEL,
        messages: [{ role: 'user', content: mensagem }]
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Erro da API do OpenRouter:', errorData);
      return res.status(response.status).json({ error: `Erro ao comunicar com a IA: ${errorData?.error?.message || response.statusText}` });
    }

    const data = await response.json();
    const resposta = data.choices[0]?.message?.content;

    if (resposta) {
      res.json({ resposta });
    } else {
      res.status(500).json({ error: 'Resposta da IA inválida ou ausente.' });
    }

  } catch (error) {
    console.error('Erro ao processar a requisição:', error);
    res.status(500).json({ error: `Erro interno do servidor: ${error.message}` });
  }
});

app.get('/', (req, res) => {
  res.send('Backend da IA de Emoção está funcionando!');
});

app.listen(port, () => {
  console.log(`Servidor backend rodando em http://localhost:${port}`);
});