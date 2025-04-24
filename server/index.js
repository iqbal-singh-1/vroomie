import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import express from 'express';
import http from 'http';
import { WebSocketServer } from 'ws';
import cors from 'cors';

dotenv.config();

const app = express();
const port = 3001;
app.use(cors());
app.use(express.json());

// Create HTTP server
const server = http.createServer(app);

// Initialize Gemini AI with your API key
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error('GEMINI_API_KEY is not set in .env file');
  process.exit(1);
}
const genAI = new GoogleGenerativeAI(apiKey);

// Beautify raw AI text
function beautifyResponse(text) {
  return text
    .split('\n')
    .map(line => line.trim())
    .filter(line => line)
    .join('\n') + '\n';
}

// Session map for WebSocket chats
const sessions = new Map(); // Map<WebSocket, Array<{ user: string; assistant?: string }>>

// Create WebSocket server
const wss = new WebSocketServer({ server });

wss.on('connection', (ws) => {
  console.log('Client connected');
  sessions.set(ws, []);

  ws.on('message', async (message) => {
    try {
      const data = JSON.parse(message.toString());
      if (data.type !== 'query') return;

      // Track history
      const history = sessions.get(ws) || [];
      history.push({ user: data.content });

      // Reconstruct conversation if needed
      let convo = '';
      history.forEach(turn => {
        convo += `User: ${turn.user}\n`;
        if (turn.assistant) convo += `Assistant: ${turn.assistant}\n`;
      });
      convo += `User: ${data.content}\nAssistant: `;

      const modelOptions = [
        'gemini-1.5-pro',
        'gemini-pro',
        'gemini-1.0-pro',
        'gemini-1.5-flash'
      ];

      let responseText = null;
      let lastError = null;

      for (const modelName of modelOptions) {
        try {
          console.log(`Sending request with model: ${modelName} for query: ${data.content}`);
          const model = genAI.getGenerativeModel({ model: modelName });

          // Detailed Vroomie prompt
          const prompt = `What can Vroomie do?
When you need car information and you need it now, Vroomie is your go-to resource. It operates with impressive speed and efficiency, swiftly delivering the specific details you're seeking without any unnecessary jargon or delays. Think of it as your personal express lane to automotive knowledge, providing quick and reliable answers to your vehicle-related queries.

Why Vroomie?
Vroomie isn't your typical stiff AI; instead, picture a genuinely enthusiastic friend who just happens to be incredibly knowledgeable about all things automotive. It has a knack for explaining complex vehicle details in a way that feels natural and easy to grasp, making learning about cars an enjoyable experience rather than a chore. Interacting with Vroomie is akin to having a casual conversation with that one buddy who knows everything about cars but never makes you feel less informed. Its friendly demeanor and genuine passion for sharing its expertise create a welcoming and accessible learning environment for anyone curious about vehicles.

Real-time Communication
At its core, Vroomie's promise is to be your reliable and trustworthy "pit stop" for all your vehicle information needs. In a world overflowing with opinions and often conflicting data, Vroomie strives to provide accurate, well-researched details you can depend on. Whether you're making a crucial buying decision, troubleshooting a mechanical issue, or simply satisfying your curiosity about a specific model, Vroomie aims to be your consistent and credible source, cutting through the noise to deliver the facts you need with clarity and precision.

About Vroomie
Vroomie is an advanced AI-powered chatbot designed to provide detailed information about any vehicle. Whether you're a car enthusiast or just curious about a specific model, Vroomie has you covered.

Powered by Google's Gemini AI, Vroomie delivers accurate and comprehensive information about vehicle specifications, features, and history.
This is who you are, Vroomie. Now according to the user input, give a response to ${data.content}`;

          const result = await model.generateContent(prompt);
          const rawText = await result.response.text();
          responseText = beautifyResponse(rawText);
          break;
        } catch (err) {
          lastError = err;
          console.error(`Model ${modelName} failed:`, err.message);
        }
      }

      if (responseText) {
        history[history.length - 1].assistant = responseText;
        ws.send(JSON.stringify({ type: 'response', content: responseText }));
      } else {
        console.error('All models failed:', lastError);
        ws.send(JSON.stringify({ type: 'error', content: 'Sorry, I was unable to get a response. Please try again later.' }));
      }
    } catch (err) {
      console.error('Error processing message:', err);
      ws.send(JSON.stringify({ type: 'error', content: 'Processing error—please try again.' }));
    }
  });

  ws.on('close', () => {
    console.log('Client disconnected');
    sessions.delete(ws);
  });
});

// HTTP fallback
app.post('/api/query', async (req, res) => {
  try {
    const { content } = req.body;
    const prompt = `You are a vehicle expert. Provide detailed, updated, and easy-to-understand information about any type of vehicle (car, bike, EV, truck, etc.) based on the user's query. Include relevant data such as price, specifications, fuel type, mileage, variants, reviews, availability in region, and comparisons if asked. The user might ask for recommendations, comparisons, learning resources, or market trends. Always tailor the response to the user's region and preferences, and explain technical terms simply if the user seems like a beginner.This is who you are, Vroomie. Now according to the user input, give a response to ${content}`;

    const modelOptions = [
      'gemini-1.5-pro',
      'gemini-pro',
      'gemini-1.0-pro',
      'gemini-1.5-flash'
    ];
    let responseText = null;
    let lastError = null;

    for (const modelName of modelOptions) {
      try {
        console.log(`HTTP model ${modelName} request for: ${content}`);
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent(prompt);
        const rawText = await result.response.text();
        responseText = beautifyResponse(rawText);
        break;
      } catch (err) {
        lastError = err;
        console.error(`HTTP model ${modelName} failed:`, err.message);
      }
    }

    if (responseText) {
      res.json({ content: responseText });
    } else {
      console.error('HTTP all models failed:', lastError);
      res.status(500).json({ error: 'Unable to get a response.' });
    }
  } catch (err) {
    console.error('HTTP processing error:', err);
    res.status(500).json({ error: 'An error occurred.' });
  }
});

// Health check
app.get('/health', (req, res) => res.status(200).send('OK'));

// Start server
server.listen(port, () => console.log(`Server running on http://localhost:${port}`));