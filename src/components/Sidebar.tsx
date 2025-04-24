import { Search } from 'lucide-react';
import React, { useState } from 'react';
import { Chat } from '../types';

interface SidebarProps {
  chats: Chat[];
  onSelectChat: (chat: Chat) => void;
  activeChat?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ chats, onSelectChat, activeChat }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredChats = chats.filter((chat) =>
    chat.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-full w-64 border-r bg-white p-4 pt-[80px] shadow-md transition-colors duration-300 dark:bg-gray-800 dark:border-gray-700">
      <div className="mb-4 pl-10">
        <div className="relative">
          <input
            type="text"
            placeholder="Search chats..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-gray-300 p-2 pl-8 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
          />
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
        </div>
      </div>
      <div className="max-h-[calc(100vh-120px)] overflow-y-auto space-y-2">
        {filteredChats.length > 0 ? (
          filteredChats.map((chat) => (
            <button
              key={chat.id}
              onClick={() => onSelectChat(chat)}
              className={`w-full rounded-lg p-2 text-left transition-all duration-300 ${
                activeChat === chat.id
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-neon-light dark:shadow-neon-dark'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white'
              }`}
            >
              <p className="font-medium truncate">{chat.title}</p>
              <p className={`text-sm ${
                activeChat === chat.id
                  ? 'text-gray-100'
                  : 'text-gray-500 dark:text-gray-400'
              }`}>
                {new Date(chat.timestamp).toLocaleDateString()}
              </p>
            </button>
          ))
        ) : (
          <p className="text-center text-gray-500 dark:text-gray-400">No chats found</p>
        )}
      </div>
    </div>
  );
};
