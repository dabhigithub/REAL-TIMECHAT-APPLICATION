export interface User {
  id: string;
  username: string;
  displayName: string;
  avatar?: string;
}

export interface Message {
  id: string;
  text: string;
  senderId: string;
  timestamp: string;
  read?: boolean;
  delivered?: boolean;
}

export interface Conversation {
  id: string;
  participants: string[];
  lastMessage?: Message;
  unreadCount?: number;
}

export interface ConversationListProps {
  conversations: Record<string, Conversation>;
  currentUser: User;
  onSelectConversation: (conversationId: string) => void;
  activeConversation: string | null;
  onlineUsers: string[];
  darkMode: boolean;
  toggleTheme: () => void;
}

export interface ChatProps {
  conversation: Conversation | null;
  currentUser: User;
  messages: Message[];
  sendMessage: (text: string) => void;
  typingUsers: string[];
  darkMode: boolean;
  toggleTheme: () => void;
}

export interface MessageInputProps {
  onSendMessage: (message: string) => void;
}

export interface MessageBubbleProps {
  message: Message;
  isOwnMessage: boolean;
  showAvatar?: boolean;
  partnerAvatar?: string;
}

export interface Theme {
  primary: string;
  secondary: string;
  text: string;
  background: string;
  sidebarBg: string;
  inputBg: string;
  messageBg: string;
  hoverBg: string;
  border: string;
}

export const lightTheme: Theme = {
  primary: '#0A84FF',
  secondary: '#E5E5EA',
  text: '#000000',
  background: '#FFFFFF',
  sidebarBg: '#F2F2F7',
  inputBg: '#FFFFFF',
  messageBg: '#F2F2F7',
  hoverBg: '#E5E5EA',
  border: '#D1D1D6'
};

export const darkTheme: Theme = {
  primary: '#0A84FF',
  secondary: '#2C2C2E',
  text: '#FFFFFF',
  background: '#1C1C1E',
  sidebarBg: '#2C2C2E',
  inputBg: '#1C1C1E',
  messageBg: '#3A3A3C',
  hoverBg: '#3A3A3C',
  border: '#3A3A3C'
}; 