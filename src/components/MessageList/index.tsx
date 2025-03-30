import React from 'react';
import MessagesPanel from '../MessagesPanel';
import { Message, User } from '../types';

interface MessageListProps {
  messages: Message[];
  currentUser: User;
}

const MessageList: React.FC<MessageListProps> = ({ messages, currentUser }) => {
  return (
    <MessagesPanel 
      messages={messages}
      currentUser={currentUser}
      typingUsers={[]}
    />
  );
};

export default MessageList; 