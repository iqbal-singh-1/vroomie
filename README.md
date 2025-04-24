# AutoBot - Vehicle Information Chatbot

AutoBot is an AI-powered chatbot that provides detailed information about vehicles using Google's Gemini AI.

## Features

- Real-time chat interface
- Vehicle information lookup using Gemini AI
- WebSocket communication for instant responses
- Modern, responsive UI with Tailwind CSS
- Mobile-friendly design

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory and add your Gemini API key:
   ```
   GEMINI_API_KEY=your_api_key_here
   ```
4. Start the backend server:
   ```bash
   npm run dev:server
   ```
5. Start the frontend development server:
   ```bash
   npm run dev
   ```
6. Open your browser and navigate to the local development server URL

## Tech Stack

- Frontend: React, Tailwind CSS, TypeScript
- Backend: Node.js, Express, WebSocket
- AI: Google Gemini API