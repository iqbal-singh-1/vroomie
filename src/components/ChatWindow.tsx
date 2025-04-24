import React, { useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { MessageCircle, User } from 'lucide-react';
import { Message } from '../types';

interface ChatWindowProps {
  messages: Message[];
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ messages }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50 p-4 space-y-4 dark:bg-gray-900">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex items-start gap-3 ${
            message.type === 'user' ? 'flex-row-reverse' : ''
          }`}
        >
          <div
            className={`rounded-full p-2 shadow-lg transition-transform duration-300 hover:scale-110 ${
              message.type === 'user'
                ? 'bg-blue-500 text-white'
                : 'bg-white text-blue-500 dark:bg-gray-800 dark:text-blue-400'
            }`}
          >
            {message.type === 'user' ? (
              <User className="h-6 w-6" />
            ) : (
              <MessageCircle className="h-6 w-6" />
            )}
          </div>
          <div
            className={`relative rounded-lg p-4 shadow-lg transition-all duration-300 hover:shadow-xl ${
              message.type === 'user'
                ? 'bg-blue-500 text-white'
                : 'bg-white dark:bg-gray-800 dark:text-white'
            }`}
          >
            <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-100"></div>
            <div className="relative max-w-[80%] whitespace-pre-wrap break-words">
              <ReactMarkdown>{message.content}</ReactMarkdown>
            </div>
          </div>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};
