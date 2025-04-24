export interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
}

export interface Chat {
  id: string;
  title: string;
  messages: Message[];
  timestamp: Date;
}

export interface Theme {
  isDark: boolean;
  toggleTheme: () => void;
}