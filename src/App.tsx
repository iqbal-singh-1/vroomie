import React, { useCallback, useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ChatInput } from './components/ChatInput';
import { ChatWindow } from './components/ChatWindow';
import { Header } from './components/Header';
import { LandingPage } from './components/LandingPage';
import { Sidebar } from './components/Sidebar';
import { ThemeProvider } from './context/ThemeContext';
import { Chat, ChatState, Message } from './types';
import { Menu, ArrowLeft } from 'lucide-react';

const WEBSOCKET_URL = import.meta.env.VITE_WEBSOCKET_URL || 'ws://localhost:3001';
const API_FALLBACK_URL = import.meta.env.VITE_API_FALLBACK_URL || 'http://localhost:3001/api';

function ChatApp() {
  const [chatState, setChatState] = useState<ChatState>({ messages: [], isLoading: false });
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChat, setActiveChat] = useState<string | undefined>();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isNavbarVisible, setIsNavbarVisible] = useState(true);
  const [lastMouseY, setLastMouseY] = useState(0);
  const [wsConnected, setWsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected' | 'failed'>('connecting');

  useEffect(() => {
    let timeoutId: number;
    const handleMouseMove = (e: MouseEvent) => {
      const isTopArea = e.clientY < 60;
      setIsNavbarVisible(isTopArea);
      setLastMouseY(e.clientY);
      if (!isTopArea) timeoutId = window.setTimeout(() => setIsNavbarVisible(false), 2000);
      else clearTimeout(timeoutId);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => { window.removeEventListener('mousemove', handleMouseMove); clearTimeout(timeoutId); };
  }, []);

  useEffect(() => {
    const welcomeMessage: Message = {
      id: Date.now().toString(),
      type: 'bot',
      content: "Hi there! 🚗 Just tell me the name of any vehicle and I'll give you all the juicy details.",
      timestamp: new Date(),
    };
    setChatState((prev) => ({ ...prev, messages: [...prev.messages, welcomeMessage] }));
  }, []);

  useEffect(() => {
    let reconnectAttempts = 0;
    let reconnectTimeout: NodeJS.Timeout | null = null;
    const MAX_RECONNECT_ATTEMPTS = 5;
    const INITIAL_RECONNECT_INTERVAL = 1000;

    const connectWebSocket = () => {
      setConnectionStatus('connecting');
      let socket: WebSocket;
      try { socket = new WebSocket(WEBSOCKET_URL); } catch (error) {
        console.error('Failed to create WebSocket instance:', error);
        setConnectionStatus('failed');
        return null;
      }

      socket.onopen = () => {
        console.log('Connected to WebSocket');
        setWsConnected(true);
        setConnectionStatus('connected');
        reconnectAttempts = 0;
      };

      socket.onmessage = (event) => {
        try {
          const response = JSON.parse(event.data);
          const newMessage: Message = {
            id: Date.now().toString(),
            type: 'bot',
            content: response.content,
            timestamp: new Date(),
          };
          setChatState((prev) => ({ isLoading: false, messages: [...prev.messages, newMessage] }));
          if (!activeChat) {
            const newChat: Chat = {
              id: Date.now().toString(),
              title: chatState.messages.length > 0 ? chatState.messages[chatState.messages.length - 1]?.content?.slice(0, 30) || 'New Chat' : 'New Chat',
              messages: [...chatState.messages, newMessage],
              timestamp: new Date(),
            };
            setChats((prev) => [newChat, ...prev]);
            setActiveChat(newChat.id);
          } else {
            setChats((prev) => prev.map((chat) => chat.id === activeChat ? { ...chat, messages: [...chat.messages, newMessage], timestamp: new Date() } : chat));
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      socket.onerror = (error) => {
        console.error('WebSocket error:', error);
        setWsConnected(false);
        setConnectionStatus('disconnected');
      };

      socket.onclose = (event) => {
        console.log(`WebSocket connection closed: ${event.code} ${event.reason || ''}`);
        setWsConnected(false);
        setConnectionStatus('disconnected');
        if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
          const reconnectInterval = INITIAL_RECONNECT_INTERVAL * Math.pow(2, reconnectAttempts);
          reconnectAttempts++;
          if (reconnectAttempts === 1) {
            const reconnectingMessage: Message = {
              id: Date.now().toString(),
              type: 'bot',
              content: "Connection lost. Attempting to reconnect...",
              timestamp: new Date(),
            };
            setChatState((prev) => ({ ...prev, messages: [...prev.messages, reconnectingMessage] }));
          }
          if (reconnectTimeout) clearTimeout(reconnectTimeout);
          reconnectTimeout = setTimeout(() => {
            const newSocket = connectWebSocket();
            if (newSocket) setWs(newSocket);
          }, reconnectInterval);
        } else {
          setConnectionStatus('failed');
          const failedMessage: Message = {
            id: Date.now().toString(),
            type: 'bot',
            content: "Unable to connect to the server after multiple attempts. Please refresh the page or try again later.",
            timestamp: new Date(),
          };
          setChatState((prev) => ({ isLoading: false, messages: [...prev.messages, failedMessage] }));
        }
      };
      return socket;
    };

    const socket = connectWebSocket();
    if (socket) setWs(socket);
    return () => {
      if (reconnectTimeout) clearTimeout(reconnectTimeout);
      if (ws && ws.readyState !== WebSocket.CLOSED) ws.close();
    };
  }, []);

  const sendMessageViaHTTP = async (content: string) => {
    try {
      const response = await fetch(`${API_FALLBACK_URL}/query`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      const newMessage: Message = {
        id: Date.now().toString(),
        type: 'bot',
        content: data.content,
        timestamp: new Date(),
      };
      setChatState((prev) => ({ isLoading: false, messages: [...prev.messages, newMessage] }));
      return true;
    } catch (error) {
      console.error('Error using HTTP fallback:', error);
      return false;
    }
  };

  const handleSendMessage = useCallback(async (content: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content,
      timestamp: new Date(),
    };
    setChatState((prev) => ({ isLoading: true, messages: [...prev.messages, newMessage] }));
    if (!activeChat) {
      const newChat: Chat = {
        id: Date.now().toString(),
        title: content.slice(0, 30) + (content.length > 30 ? '...' : ''),
        messages: [...chatState.messages, newMessage],
        timestamp: new Date(),
      };
      setChats((prev) => [newChat, ...prev]);
      setActiveChat(newChat.id);
    } else {
      setChats((prev) => prev.map((chat) => chat.id === activeChat ? { ...chat, messages: [...chat.messages, newMessage], timestamp: new Date() } : chat));
    }
    if (ws && ws.readyState === WebSocket.OPEN) {
      try { ws.send(JSON.stringify({ type: 'query', content })); return; } catch (error) { console.error('Error sending WebSocket message:', error); }
    }
    const httpSuccess = await sendMessageViaHTTP(content);
    if (!httpSuccess) {
      const errorMessage: Message = {
        id: Date.now().toString(),
        type: 'bot',
        content: "Sorry, I'm unable to connect to the server. Please check your internet connection and try again later.",
        timestamp: new Date(),
      };
      setChatState((prev) => ({ isLoading: false, messages: [...prev.messages, errorMessage] }));
      if (ws) ws.close();
    }
  }, [ws, activeChat, chatState.messages]);

  const handleSelectChat = (chat: Chat) => {
    setActiveChat(chat.id);
    setChatState({ messages: chat.messages, isLoading: false });
  };

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="flex h-screen flex-col bg-gray-100 dark:bg-gray-900">
      <div className={`fixed top-0 z-50 w-full`}>
        <Header />
      </div>
      <div className="flex flex-1 overflow-hidden pt-16">
        <button
          onClick={toggleSidebar}
          className="fixed left-2 top-20 z-40 rounded-full bg-blue-500 p-2 text-white shadow-lg transition-all hover:bg-blue-600"
        >
          {isSidebarOpen ? <ArrowLeft className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
        {isSidebarOpen && (
          <div className="fixed left-0 top-0 z-30 h-full">
            <Sidebar chats={chats} onSelectChat={handleSelectChat} activeChat={activeChat} />
          </div>
        )}
        <main className={`flex flex-1 flex-col transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}>
          {connectionStatus === 'failed' && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 mx-4 mt-2 rounded shadow-md">
              <p className="font-bold">Connection Error</p>
              <p>Unable to connect to the server. Please check if the server is running and refresh the page.</p>
            </div>
          )}
          <ChatWindow messages={chatState.messages} />
          <ChatInput onSendMessage={handleSendMessage} isLoading={chatState.isLoading} />
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/chat" element={<ChatApp />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
