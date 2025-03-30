import React from 'react';
import styled, { useTheme } from 'styled-components';
import { Message, MessageBubbleProps } from '../types';

const BubbleContainer = styled.div<{ isOwnMessage: boolean }>`
  display: flex;
  justify-content: ${(props) => (props.isOwnMessage ? 'flex-end' : 'flex-start')};
  margin-bottom: 8px;
  position: relative;
  padding: 0 16px;
`;

const Bubble = styled.div<{ isOwnMessage: boolean; theme: any }>`
  max-width: 65%;
  padding: 8px 12px;
  border-radius: ${(props) => 
    props.isOwnMessage ? '8px 8px 0px 8px' : '8px 8px 8px 0px'};
  background-color: ${(props) => 
    props.isOwnMessage ? props.theme.primary : props.theme.messageBg};
  color: ${(props) => 
    props.isOwnMessage ? '#fff' : props.theme.text};
  position: relative;
  overflow-wrap: break-word;
  word-wrap: break-word;
  word-break: break-word;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  
  &::before {
    content: '';
    position: absolute;
    bottom: 0;
    width: 10px;
    height: 10px;
    ${(props) => 
      props.isOwnMessage
        ? 'right: -6px; border-bottom-left-radius: 15px;'
        : 'left: -6px; border-bottom-right-radius: 15px;'
    }
    background-color: ${(props) => 
      props.isOwnMessage ? props.theme.primary : props.theme.messageBg};
  }
`;

const MessageText = styled.p`
  margin: 0;
  font-size: 14px;
  line-height: 1.4;
`;

const TimestampAndStatus = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-top: 4px;
  font-size: 11px;
  color: ${(props) => props.color};
  gap: 4px;
`;

const MessageStatus = styled.span`
  display: flex;
  align-items: center;
`;

const Avatar = styled.img`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  margin-right: 8px;
  align-self: flex-end;
  margin-bottom: 15px;
  object-fit: cover;
`;

const formatTime = (timestamp: string) => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const MessageBubble: React.FC<MessageBubbleProps> = ({ 
  message, 
  isOwnMessage,
  showAvatar = false,
  partnerAvatar
}) => {
  const theme = useTheme();
  
  // Determine if message has been read
  const messageStatus = () => {
    if (!isOwnMessage) return null;
    
    if (message.read) {
      // Read message - blue double check
      return (
        <MessageStatus>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2.67 8.8L5.33 11.47L7.33 9.47M8.67 9.47L10.67 11.47L13.33 8.8M2.67 8.8L5.33 11.47L7.33 9.47M8.67 9.47L10.67 11.47L13.33 8.8" stroke="#0096FF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </MessageStatus>
      );
    } else if (message.delivered) {
      // Delivered message - gray double check
      return (
        <MessageStatus>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2.67 8.8L5.33 11.47L7.33 9.47M8.67 9.47L10.67 11.47L13.33 8.8M2.67 8.8L5.33 11.47L7.33 9.47M8.67 9.47L10.67 11.47L13.33 8.8" stroke="#B0B0B0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </MessageStatus>
      );
    } else {
      // Sent message - gray single check
      return (
        <MessageStatus>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8.67 9.47L10.67 11.47L13.33 8.8M8.67 9.47L10.67 11.47L13.33 8.8" stroke="#B0B0B0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </MessageStatus>
      );
    }
  };
  
  return (
    <BubbleContainer isOwnMessage={isOwnMessage}>
      {!isOwnMessage && showAvatar && (
        <Avatar 
          src={partnerAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${Math.random()}`} 
          alt="User avatar" 
        />
      )}
      <Bubble isOwnMessage={isOwnMessage} theme={theme}>
        <MessageText>{message.text}</MessageText>
        <TimestampAndStatus color={isOwnMessage ? '#ffffffaa' : `${theme.text}aa`}>
          {formatTime(message.timestamp)}
          {messageStatus()}
        </TimestampAndStatus>
      </Bubble>
    </BubbleContainer>
  );
};

export default MessageBubble; 