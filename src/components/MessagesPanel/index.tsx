import React, { useEffect, useRef } from 'react';
import styled, { useTheme } from 'styled-components';
import MessageBubble from '../MessageBubble';
import { Message, User } from '../types';

interface MessagesPanelProps {
  messages: Message[];
  currentUser: User;
  typingUsers: string[];
  partnerName?: string;
}

const Container = styled.div<{ theme: any }>`
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 20px 0;
  overflow-y: auto;
  background-color: ${props => props.theme.background};
  scroll-behavior: smooth;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  
  &::-webkit-scrollbar-thumb {
    background-color: ${props => props.theme.secondary}70;
    border-radius: 10px;
  }
`;

const DateSeparator = styled.div<{ theme: any }>`
  display: flex;
  justify-content: center;
  margin: 12px 0;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 16px;
    right: 16px;
    height: 1px;
    background-color: ${props => props.theme.secondary}50;
    z-index: 0;
  }
`;

const DateBadge = styled.span<{ theme: any }>`
  background-color: ${props => props.theme.secondary}50;
  color: ${props => props.theme.text};
  font-size: 12px;
  padding: 4px 12px;
  border-radius: 8px;
  z-index: 1;
`;

const TypingIndicator = styled.div<{ theme: any }>`
  display: flex;
  align-items: center;
  padding: 0 16px;
  margin-top: 8px;
  font-size: 14px;
  color: ${props => props.theme.text}aa;
  
  .dots {
    display: flex;
    margin-left: 5px;
  }
  
  .dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background-color: ${props => props.theme.text}aa;
    margin: 0 1px;
    animation: bounce 1.5s infinite;
  }
  
  .dot:nth-child(2) {
    animation-delay: 0.1s;
  }
  
  .dot:nth-child(3) {
    animation-delay: 0.2s;
  }
  
  @keyframes bounce {
    0%, 100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-8px);
    }
  }
`;

const EndOfMessages = styled.div`
  height: 20px;
`;

const MessagesPanel: React.FC<MessagesPanelProps> = ({ messages, currentUser, typingUsers, partnerName }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const theme = useTheme();
  
  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, typingUsers]);
  
  // Format dates for display
  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString(undefined, { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    }
  };
  
  // Group messages by date
  const groupMessagesByDate = () => {
    const groups: { [key: string]: Message[] } = {};
    
    messages.forEach(message => {
      const dateStr = formatDate(message.timestamp);
      if (!groups[dateStr]) {
        groups[dateStr] = [];
      }
      groups[dateStr].push(message);
    });
    
    return groups;
  };
  
  // Determine whether to show avatar (for first message in a sequence from the same sender)
  const shouldShowAvatar = (index: number, messages: Message[]) => {
    if (index === 0) return true;
    
    const prevMessage = messages[index - 1];
    const currMessage = messages[index];
    
    // Show avatar if this is the first message from this sender after another sender
    return prevMessage.senderId !== currMessage.senderId;
  };
  
  const groupedMessages = groupMessagesByDate();
  
  return (
    <Container theme={theme}>
      {Object.entries(groupedMessages).map(([dateStr, msgs]) => (
        <React.Fragment key={dateStr}>
          <DateSeparator theme={theme}>
            <DateBadge theme={theme}>{dateStr}</DateBadge>
          </DateSeparator>
          
          {msgs.map((message, index) => (
            <MessageBubble
              key={message.id}
              message={message}
              isOwnMessage={message.senderId === currentUser.id}
              showAvatar={shouldShowAvatar(index, msgs) && message.senderId !== currentUser.id}
              partnerAvatar={`https://api.dicebear.com/7.x/avataaars/svg?seed=${partnerName || message.senderId}`}
            />
          ))}
        </React.Fragment>
      ))}
      
      {typingUsers.length > 0 && (
        <TypingIndicator theme={theme}>
          {partnerName || 'User'} is typing
          <div className="dots">
            <div className="dot"></div>
            <div className="dot"></div>
            <div className="dot"></div>
          </div>
        </TypingIndicator>
      )}
      
      <EndOfMessages ref={messagesEndRef} />
    </Container>
  );
};

export default MessagesPanel; 