import React, { useState } from 'react';
import styled, { useTheme } from 'styled-components';
import { MessageInputProps } from '../types';

const Container = styled.div<{ theme: any }>`
  display: flex;
  align-items: center;
  padding: 10px 16px;
  background-color: ${props => props.theme.inputBg};
  border-top: 1px solid ${props => props.theme.secondary}30;
`;

const EmojiButton = styled.button<{ theme: any }>`
  background: none;
  border: none;
  cursor: pointer;
  margin-right: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  border-radius: 50%;
  color: ${props => props.theme.text}aa;
  transition: background-color 0.2s ease, color 0.2s ease;
  
  &:hover {
    background-color: ${props => props.theme.secondary}50;
    color: ${props => props.theme.text};
  }
`;

const AttachButton = styled(EmojiButton)``;

const Input = styled.input<{ theme: any }>`
  flex: 1;
  padding: 12px 16px;
  font-size: 15px;
  border: none;
  border-radius: 24px;
  background-color: ${props => props.theme.secondary}30;
  color: ${props => props.theme.text};
  
  &::placeholder {
    color: ${props => props.theme.text}80;
  }
  
  &:focus {
    outline: none;
  }
`;

const SendButton = styled.button<{ hasText: boolean; theme: any }>`
  background: none;
  border: none;
  cursor: ${props => (props.hasText ? 'pointer' : 'default')};
  opacity: ${props => (props.hasText ? '1' : '0.5')};
  margin-left: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  border-radius: 50%;
  color: ${props => props.theme.primary};
  transition: background-color 0.2s ease, transform 0.2s ease;
  
  &:hover {
    background-color: ${props => props.hasText ? props.theme.secondary + '50' : 'transparent'};
    transform: ${props => props.hasText ? 'scale(1.1)' : 'scale(1)'};
  }
`;

const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage }) => {
  const [message, setMessage] = useState('');
  const theme = useTheme();
  
  const handleSendMessage = () => {
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  return (
    <Container theme={theme}>
      <EmojiButton theme={theme}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M8 14C8 14 9.5 16 12 16C14.5 16 16 14 16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M9 9H9.01" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M15 9H15.01" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </EmojiButton>
      
      <AttachButton theme={theme}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M21.44 11.05L12.25 20.24C11.1242 21.3658 9.59717 21.9983 8.005 21.9983C6.41283 21.9983 4.88579 21.3658 3.76 20.24C2.63421 19.1142 2.00171 17.5872 2.00171 15.995C2.00171 14.4028 2.63421 12.8758 3.76 11.75L12.95 2.56C13.7006 1.80943 14.7167 1.3877 15.78 1.3877C16.8434 1.3877 17.8594 1.80943 18.61 2.56C19.3606 3.31057 19.7823 4.32663 19.7823 5.39C19.7823 6.45337 19.3606 7.46943 18.61 8.22L9.41 17.41C9.03472 17.7853 8.52668 17.9961 8 17.9961C7.47332 17.9961 6.96528 17.7853 6.59 17.41C6.21472 17.0347 6.00389 16.5267 6.00389 16C6.00389 15.4733 6.21472 14.9653 6.59 14.59L15.07 6.11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </AttachButton>
      
      <Input
        theme={theme}
        placeholder="Type a message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={handleKeyPress}
      />
      
      <SendButton 
        hasText={message.trim().length > 0} 
        onClick={handleSendMessage}
        theme={theme}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M22 2L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </SendButton>
    </Container>
  );
};

export default MessageInput; 