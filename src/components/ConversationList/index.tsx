import React, { useState } from 'react';
import styled, { useTheme } from 'styled-components';
import { Conversation, User, ConversationListProps } from '../types';
import axios from 'axios';

const Container = styled.div<{ theme: any }>`
  display: flex;
  flex-direction: column;
  width: 350px;
  height: 100%;
  background-color: ${props => props.theme.sidebarBg};
  border-right: 1px solid ${props => props.theme.secondary};
  
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const Header = styled.div<{ theme: any }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 16px;
  background-color: ${props => props.theme.sidebarBg};
  height: 60px;
  color: ${props => props.theme.text};
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
`;

const Avatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
  object-fit: cover;
`;

const UserName = styled.span`
  font-weight: bold;
`;

const Actions = styled.div`
  display: flex;
  gap: 16px;
  color: ${props => props.theme.text};
  
  svg {
    cursor: pointer;
    width: 24px;
    height: 24px;
    transition: transform 0.2s ease;
    
    &:hover {
      transform: scale(1.1);
    }
  }
`;

const SearchContainer = styled.div<{ theme: any }>`
  padding: 8px 16px;
  background-color: ${props => props.theme.sidebarBg};
`;

const SearchInput = styled.input<{ theme: any }>`
  width: 100%;
  padding: 12px 32px 12px 16px;
  border: none;
  border-radius: 8px;
  background-color: ${props => props.theme.inputBg};
  font-size: 14px;
  color: ${props => props.theme.text};
  
  &::placeholder {
    color: ${props => props.theme.text}80;
  }
  
  &:focus {
    outline: none;
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  right: 26px;
  top: 77px;
  color: #54656f;
`;

const ConversationsContainer = styled.div`
  flex: 1;
  overflow-y: auto;
`;

const ConversationItem = styled.div<{ isActive: boolean; theme: any }>`
  display: flex;
  padding: 12px 16px;
  border-bottom: 1px solid ${props => props.theme.secondary}30;
  cursor: pointer;
  background-color: ${props => props.isActive ? 
    props.theme.secondary : props.theme.sidebarBg};
  
  &:hover {
    background-color: ${props => props.isActive ? 
      props.theme.secondary : 
      props.theme.secondary}70;
  }
`;

const ConversationAvatar = styled.img`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  margin-right: 15px;
  object-fit: cover;
`;

const ConversationDetails = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const ConversationHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 4px;
`;

const ConversationName = styled.span<{ theme: any }>`
  font-weight: bold;
  color: ${props => props.theme.text};
  display: flex;
  align-items: center;
`;

const ConversationTime = styled.span<{ theme: any }>`
  font-size: 12px;
  color: ${props => props.theme.text}80;
`;

const ConversationLastMessage = styled.p<{ theme: any }>`
  font-size: 13px;
  color: ${props => props.theme.text}99;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 200px;
`;

const OnlineIndicator = styled.div`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: #25D366;
  margin-left: 5px;
  display: inline-block;
`;

const UnreadBadge = styled.div`
  background-color: #25D366;
  color: white;
  font-size: 12px;
  font-weight: bold;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 8px;
`;

const NewConversationBtn = styled.button<{ theme: any }>`
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: ${props => props.theme.primary};
  color: white;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
  cursor: pointer;
  z-index: 10;
  transition: transform 0.3s ease, background-color 0.3s ease;
  
  &:hover {
    transform: scale(1.05);
    background-color: ${props => props.theme.primary}dd;
  }
`;

const ThemeToggle = styled.button<{ darkMode: boolean }>`
  background: none;
  border: none;
  color: inherit;
  cursor: pointer;
  padding: 5px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  
  svg {
    fill: ${props => props.darkMode ? '#E9EDEF' : '#54656f'};
    transition: fill 0.3s ease;
  }
  
  &:hover svg {
    fill: ${props => props.darkMode ? '#fff' : '#000'};
  }
`;

const NewConversationModal = styled.div<{ theme: any }>`
  position: absolute;
  bottom: 90px;
  right: 20px;
  width: 300px;
  background-color: ${props => props.theme.sidebarBg};
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  z-index: 11;
  
  h3 {
    color: ${props => props.theme.text};
    margin-top: 0;
    margin-bottom: 16px;
  }
  
  input {
    width: 100%;
    padding: 12px;
    margin-bottom: 16px;
    border: none;
    border-radius: 8px;
    background-color: ${props => props.theme.inputBg};
    color: ${props => props.theme.text};
    
    &:focus {
      outline: none;
    }
  }
  
  .buttons {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
  }
`;

const Button = styled.button<{ primary?: boolean; theme: any }>`
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  background-color: ${props => props.primary ? props.theme.primary : 'transparent'};
  color: ${props => props.primary ? 'white' : props.theme.text};
  
  &:hover {
    background-color: ${props => props.primary ? props.theme.primary + 'dd' : props.theme.secondary + '80'};
  }
`;

const ConversationList: React.FC<ConversationListProps> = ({
  conversations,
  currentUser,
  onSelectConversation,
  activeConversation,
  onlineUsers,
  darkMode,
  toggleTheme
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const theme = useTheme();
  
  // Format timestamp to readable format
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    // Check if it's today
    if (date.getTime() > today.getTime()) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    
    // Check if it's yesterday
    if (date.getTime() > yesterday.getTime()) {
      return 'Yesterday';
    }
    
    // Older than yesterday
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };
  
  // Get conversation partner's username from conversation
  const getConversationPartner = (conversation: Conversation) => {
    const partnerId = conversation.participants.find(id => id !== currentUser.id);
    // In a real app, you would fetch the user information from your user store
    return partnerId || 'Unknown User';
  };
  
  // Filter conversations based on search term
  const filteredConversations = Object.entries(conversations)
    .filter(([_, conversation]) => {
      if (!searchTerm) return true;
      const partnerName = getConversationPartner(conversation);
      return partnerName.toLowerCase().includes(searchTerm.toLowerCase());
    })
    .sort(([_, a], [__, b]) => {
      const aTime = a.lastMessage?.timestamp || '';
      const bTime = b.lastMessage?.timestamp || '';
      return new Date(bTime).getTime() - new Date(aTime).getTime();
    });
  
  const createNewConversation = async () => {
    if (!newUsername) return;
    
    try {
      // In a real app, you would first search for the user
      const response = await axios.get(`http://localhost:5000/api/users`);
      const users = response.data;
      
      const targetUser = users.find((user: User) => user.displayName === newUsername);
      
      if (!targetUser) {
        alert('User not found');
        return;
      }
      
      // Create a conversation ID combining the two user IDs
      const ids = [currentUser.id, targetUser.id].sort();
      const conversationId = ids.join('_');
      
      // If the conversation already exists, just select it
      if (conversations[conversationId]) {
        onSelectConversation(conversationId);
      } else {
        // Otherwise create a new one
        const newConversation: Conversation = {
          id: conversationId,
          participants: ids,
        };
        
        onSelectConversation(conversationId);
      }
      
      setIsCreatingNew(false);
      setNewUsername('');
    } catch (error) {
      console.error('Error creating conversation:', error);
      alert('Failed to create conversation. Using random ID instead.');
      
      // For demo, just create a random conversation
      const randomId = `random_user_${Math.floor(Math.random() * 1000)}`;
      const conversationId = [currentUser.id, randomId].sort().join('_');
      onSelectConversation(conversationId);
      setIsCreatingNew(false);
      setNewUsername('');
    }
  };
  
  return (
    <Container theme={theme}>
      <Header theme={theme}>
        <UserInfo>
          <Avatar 
            src={currentUser.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser.displayName}`} 
            alt={currentUser.displayName} 
          />
          <UserName>{currentUser.displayName}</UserName>
        </UserInfo>
        <Actions theme={theme}>
          <ThemeToggle darkMode={darkMode} onClick={toggleTheme}>
            {darkMode ? (
              <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 9C13.65 9 15 10.35 15 12C15 13.65 13.65 15 12 15C10.35 15 9 13.65 9 12C9 10.35 10.35 9 12 9ZM12 7C9.24 7 7 9.24 7 12C7 14.76 9.24 17 12 17C14.76 17 17 14.76 17 12C17 9.24 14.76 7 12 7ZM2 13H4C4.55 13 5 12.55 5 12C5 11.45 4.55 11 4 11H2C1.45 11 1 11.45 1 12C1 12.55 1.45 13 2 13ZM20 13H22C22.55 13 23 12.55 23 12C23 11.45 22.55 11 22 11H20C19.45 11 19 11.45 19 12C19 12.55 19.45 13 20 13ZM11 2V4C11 4.55 11.45 5 12 5C12.55 5 13 4.55 13 4V2C13 1.45 12.55 1 12 1C11.45 1 11 1.45 11 2ZM11 20V22C11 22.55 11.45 23 12 23C12.55 23 13 22.55 13 22V20C13 19.45 12.55 19 12 19C11.45 19 11 19.45 11 20ZM5.99 4.58C5.6 4.19 4.96 4.19 4.58 4.58C4.19 4.97 4.19 5.61 4.58 5.99L5.64 7.05C6.03 7.44 6.67 7.44 7.05 7.05C7.44 6.66 7.44 6.02 7.05 5.64L5.99 4.58ZM18.36 16.95C17.97 16.56 17.33 16.56 16.95 16.95C16.56 17.34 16.56 17.98 16.95 18.36L18.01 19.42C18.4 19.81 19.04 19.81 19.42 19.42C19.81 19.03 19.81 18.39 19.42 18.01L18.36 16.95ZM19.42 5.99C19.81 5.6 19.81 4.96 19.42 4.58C19.03 4.19 18.39 4.19 18.01 4.58L16.95 5.64C16.56 6.03 16.56 6.67 16.95 7.05C17.34 7.44 17.98 7.44 18.36 7.05L19.42 5.99ZM7.05 18.36C7.44 17.97 7.44 17.33 7.05 16.95C6.66 16.56 6.02 16.56 5.64 16.95L4.58 18.01C4.19 18.4 4.19 19.04 4.58 19.42C4.97 19.81 5.61 19.81 5.99 19.42L7.05 18.36Z" />
              </svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 3C7.03 3 3 7.03 3 12C3 16.97 7.03 21 12 21C12.83 21 13.63 20.88 14.39 20.68C13.55 19.81 13 18.65 13 17.35C13 14.47 15.47 12 18.35 12C19.65 12 20.81 12.55 21.68 13.39C21.88 12.63 22 11.83 22 11C22 6.03 17.97 2 13 2C7.03 2 3 6.03 3 11C3 15.97 7.03 20 12 20C12.83 20 13.63 19.88 14.39 19.68C14.22 18.32 14.1 17.93 14.03 17.53C13.38 17.83 12.71 18 12 18C7.58 18 4 14.42 4 10C4 5.58 7.58 2 12 2C16.42 2 20 5.58 20 10C20 10.71 19.83 11.38 19.53 12.03C19.93 12.1 20.32 12.22 20.68 12.39C20.88 11.63 21 10.83 21 10C21 5.03 16.97 1 12 1Z" />
              </svg>
            )}
          </ThemeToggle>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 20.4C16.6392 20.4 20.4 16.6392 20.4 12C20.4 7.36079 16.6392 3.6 12 3.6C7.36079 3.6 3.6 7.36079 3.6 12C3.6 16.6392 7.36079 20.4 12 20.4Z" stroke="currentColor" strokeWidth="2"/>
            <path d="M11.7 8.1V12.3L14.7 15.3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 8C13.1 8 14 7.1 14 6C14 4.9 13.1 4 12 4C10.9 4 10 4.9 10 6C10 7.1 10.9 8 12 8ZM12 10C10.9 10 10 10.9 10 12C10 13.1 10.9 14 12 14C13.1 14 14 13.1 14 12C14 10.9 13.1 10 12 10ZM12 16C10.9 16 10 16.9 10 18C10 19.1 10.9 20 12 20C13.1 20 14 19.1 14 18C14 16.9 13.1 16 12 16Z" fill="currentColor"/>
          </svg>
        </Actions>
      </Header>
      
      <SearchContainer theme={theme}>
        <SearchInput 
          theme={theme}
          placeholder="Search or start a new chat" 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <SearchIcon>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15.5 14H14.71L14.43 13.73C15.41 12.59 16 11.11 16 9.5C16 5.91 13.09 3 9.5 3C5.91 3 3 5.91 3 9.5C3 13.09 5.91 16 9.5 16C11.11 16 12.59 15.41 13.73 14.43L14 14.71V15.5L19 20.49L20.49 19L15.5 14ZM9.5 14C7.01 14 5 11.99 5 9.5C5 7.01 7.01 5 9.5 5C11.99 5 14 7.01 14 9.5C14 11.99 11.99 14 9.5 14Z" fill="currentColor"/>
          </svg>
        </SearchIcon>
      </SearchContainer>
      
      <ConversationsContainer>
        {filteredConversations.map(([id, conversation]) => {
          const partnerId = conversation.participants.find(pid => pid !== currentUser.id) || '';
          const isPartnerOnline = onlineUsers.includes(partnerId);
          
          return (
            <ConversationItem 
              key={id}
              isActive={activeConversation === id}
              onClick={() => onSelectConversation(id)}
              theme={theme}
            >
              <ConversationAvatar 
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${getConversationPartner(conversation)}`} 
                alt="User avatar" 
              />
              <ConversationDetails>
                <ConversationHeader>
                  <ConversationName theme={theme}>
                    {getConversationPartner(conversation)}
                    {isPartnerOnline && <OnlineIndicator />}
                    {conversation.unreadCount ? <UnreadBadge>{conversation.unreadCount}</UnreadBadge> : null}
                  </ConversationName>
                  {conversation.lastMessage && (
                    <ConversationTime theme={theme}>
                      {formatTime(conversation.lastMessage.timestamp)}
                    </ConversationTime>
                  )}
                </ConversationHeader>
                <ConversationLastMessage theme={theme}>
                  {conversation.lastMessage ? conversation.lastMessage.text : 'Start a conversation'}
                </ConversationLastMessage>
              </ConversationDetails>
            </ConversationItem>
          );
        })}
      </ConversationsContainer>
      
      <NewConversationBtn onClick={() => setIsCreatingNew(true)} theme={theme}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M19 13H13V19H11V13H5V11H11V5H13V11H19V13Z" fill="white"/>
        </svg>
      </NewConversationBtn>
      
      {isCreatingNew && (
        <NewConversationModal theme={theme}>
          <h3>New Conversation</h3>
          <input
            type="text"
            placeholder="Enter username"
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)}
            autoFocus
          />
          <div className="buttons">
            <Button onClick={() => setIsCreatingNew(false)} theme={theme}>
              Cancel
            </Button>
            <Button primary onClick={createNewConversation} theme={theme}>
              Start
            </Button>
          </div>
        </NewConversationModal>
      )}
    </Container>
  );
};

export default ConversationList; 