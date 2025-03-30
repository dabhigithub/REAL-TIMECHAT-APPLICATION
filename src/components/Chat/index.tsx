import React from 'react';
import styled, { useTheme } from 'styled-components';
import MessageInput from '../MessageInput';
import MessagesPanel from '../MessagesPanel';
import { ChatProps } from '../types';

const Container = styled.div<{ theme: any }>`
  display: flex;
  flex-direction: column;
  flex: 1;
  height: 100%;
  background-color: ${props => props.theme.background};
`;

const Header = styled.div<{ theme: any }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 16px;
  background-color: ${props => props.theme.sidebarBg};
  height: 60px;
  border-bottom: 1px solid ${props => props.theme.secondary}30;
  color: ${props => props.theme.text};
`;

const ConversationInfo = styled.div`
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

const UserDetails = styled.div`
  display: flex;
  flex-direction: column;
`;

const DisplayName = styled.span`
  font-weight: bold;
`;

const Status = styled.span<{ isOnline: boolean }>`
  font-size: 12px;
  color: ${props => props.isOnline ? '#25D366' : '#8696a0'};
`;

const Actions = styled.div<{ theme: any }>`
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

const NoConversationSelected = styled.div<{ theme: any }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  text-align: center;
  color: ${props => props.theme.text}aa;
  background-color: ${props => props.theme.background};
  
  svg {
    width: 80px;
    height: 80px;
    margin-bottom: 20px;
    opacity: 0.6;
  }
  
  h2 {
    font-size: 24px;
    margin-bottom: 10px;
  }
  
  p {
    font-size: 16px;
    max-width: 400px;
    line-height: 1.5;
  }
`;

const Chat: React.FC<ChatProps> = ({ 
  conversation, 
  currentUser, 
  messages, 
  sendMessage, 
  typingUsers, 
  darkMode, 
  toggleTheme 
}) => {
  const theme = useTheme();
  
  // Find the partner's ID (not the current user)
  const getPartnerInfo = () => {
    if (!conversation) return { id: '', name: '' };
    
    const partnerId = conversation.participants.find(id => id !== currentUser.id) || '';
    const partnerName = partnerId.replace('user_', 'User ');
    
    return { id: partnerId, name: partnerName };
  };
  
  const partner = getPartnerInfo();
  
  // For demo purposes - in a real app this would be connected to your online users logic
  const isOnline = partner.id ? Math.random() > 0.5 : false;
  
  if (!conversation) {
    return (
      <Container theme={theme}>
        <NoConversationSelected theme={theme}>
          <svg viewBox="0 0 303 172" width="360" height="280" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd" d="M229.565 160.229C262.212 149.245 286.931 118.241 283.39 73.4194C278.009 5.31929 212.313 -11.5738 171.247 10.0505C115.317 -5.18308 62.5286 -3.90567 36.3619 45.8208C19.9895 76.788 19.4603 118.17 45.3208 135.763C57.2301 179.285 97.4927 168.654 126.778 166.885C156.296 164.891 187.839 174.336 229.565 160.229Z" fill="currentColor" opacity="0.05"/>
            <path d="M253.202 69.1628C253.202 69.1628 201.98 68.1234 196.336 116.585C190.691 165.046 227.652 162.186 236.786 164.569C245.92 166.953 260.046 168.984 264.299 153.12C268.551 137.256 289.026 128.167 279.189 105.131C269.352 82.0939 253.202 69.1628 253.202 69.1628Z" fill="currentColor" opacity="0.08"/>
            <path d="M255.573 74.0497C255.573 74.0497 204.35 73.0104 198.706 121.471C193.061 169.933 230.023 167.073 239.156 169.456C248.29 171.839 262.416 173.87 266.669 158.006C270.922 142.143 291.397 133.053 281.56 110.017C271.723 86.9808 255.573 74.0497 255.573 74.0497Z" stroke="currentColor" strokeWidth="0.5" opacity="0.4"/>
            <path d="M150.183 19.9183C111.589 26.7699 78.0019 56.2258 60.8662 90.5173C48.8523 114.925 47.7837 137.384 46.5957 146.184C46.2071 148.992 47.9283 151.513 50.7544 151.826C63.8364 153.041 88.3079 154.337 109.34 147.743C134.221 139.937 155.161 125.069 164.929 93.1907C184.707 32.2322 150.183 19.9183 150.183 19.9183Z" fill="currentColor" opacity="0.08"/>
            <path d="M132.966 28.8284C94.372 35.68 60.7844 65.1359 43.6487 99.4274C31.6349 123.835 30.5663 146.294 29.3782 155.094C28.9897 157.903 30.7109 160.423 33.537 160.736C46.619 161.951 71.0904 163.247 92.1225 156.653C117.003 148.847 137.944 133.979 147.712 102.101C167.489 41.1423 132.966 28.8284 132.966 28.8284Z" stroke="currentColor" strokeWidth="0.5" opacity="0.4"/>
            <path d="M163.27 74.0605C163.27 74.0605 153.058 101.224 120.755 107.469" stroke="currentColor" strokeWidth="0.5" opacity="0.4"/>
            <rect x="47.9209" y="110.054" width="17" height="16" rx="4.5" transform="rotate(5.85325 47.9209 110.054)" fill="currentColor"/>
            <rect x="103.863" y="147.018" width="17" height="16" rx="4.5" transform="rotate(5.85325 103.863 147.018)" fill="currentColor"/>
            <rect x="72.4476" y="127.96" width="30" height="16" rx="4.5" transform="rotate(5.85325 72.4476 127.96)" fill="currentColor"/>
            <path d="M160.276 76.814C157.737 68.0557 153.66 54.5312 147.166 41.9086C144.65 35.3101 141.233 28.7599 137.1 23.0603C132.967 17.3606 128.184 12.574 122.494 10.0991C116.804 7.62424 110.354 7.70129 104.616 10.3188C98.8783 12.9363 93.6657 17.9014 89.6497 23.5719C85.6337 29.2425 82.7918 35.5728 80.7016 41.5817C76.5209 53.5995 74.6555 65.7482 74.2081 72.2385" stroke="currentColor" strokeOpacity="0.5" strokeWidth="2" strokeLinecap="round"/>
            <path d="M99.6664 90.8932C99.1259 93.0067 98.6848 95.2064 98.4311 97.3086C98.2005 99.4107 98.1506 101.351 98.2725 102.965C98.3943 104.579 98.6948 105.908 99.1554 106.947C99.6159 107.986 100.215 108.677 100.941 109.112C101.667 109.546 102.497 109.701 103.458 109.625C104.42 109.549 105.589 109.253 106.903 108.676C108.218 108.1 109.705 107.286 111.307 106.221C112.91 105.155 114.631 103.861 116.373 102.322" stroke="currentColor" strokeOpacity="0.5" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <h2>Select a conversation</h2>
          <p>Choose an existing conversation or start a new one to begin chatting</p>
        </NoConversationSelected>
      </Container>
    );
  }
  
  return (
    <Container theme={theme}>
      <Header theme={theme}>
        <ConversationInfo>
          <Avatar 
            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${partner.name}`} 
            alt={partner.name}
          />
          <UserDetails>
            <DisplayName>{partner.name}</DisplayName>
            <Status isOnline={isOnline}>
              {isOnline ? 'Online' : 'Offline'}
            </Status>
          </UserDetails>
        </ConversationInfo>
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
            <path d="M14.9998 5C14.9998 4.44772 15.4475 4 15.9998 4H16.9998C17.552 4 17.9998 4.44772 17.9998 5V19C17.9998 19.5523 17.552 20 16.9998 20H15.9998C15.4475 20 14.9998 19.5523 14.9998 19V5Z" fill="currentColor"/>
            <path d="M6.99976 5C6.99976 4.44772 7.44747 4 7.99976 4H8.99976C9.55204 4 9.99976 4.44772 9.99976 5V19C9.99976 19.5523 9.55204 20 8.99976 20H7.99976C7.44747 20 6.99976 19.5523 6.99976 19V5Z" fill="currentColor"/>
            <path d="M10.9998 12C10.9998 11.4477 11.4475 11 11.9998 11H12.9998C13.552 11 13.9998 11.4477 13.9998 12C13.9998 12.5523 13.552 13 12.9998 13H11.9998C11.4475 13 10.9998 12.5523 10.9998 12Z" fill="currentColor"/>
            <path d="M2.99976 12C2.99976 11.4477 3.44747 11 3.99976 11H4.99976C5.55204 11 5.99976 11.4477 5.99976 12C5.99976 12.5523 5.55204 13 4.99976 13H3.99976C3.44747 13 2.99976 12.5523 2.99976 12Z" fill="currentColor"/>
            <path d="M18.9998 12C18.9998 11.4477 19.4475 11 19.9998 11H20.9998C21.552 11 21.9998 11.4477 21.9998 12C21.9998 12.5523 21.552 13 20.9998 13H19.9998C19.4475 13 18.9998 12.5523 18.9998 12Z" fill="currentColor"/>
          </svg>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7 4C7 2.89543 7.89543 2 9 2H15C16.1046 2 17 2.89543 17 4V6H18C19.1046 6 20 6.89543 20 8V14C20 15.1046 19.1046 16 18 16H17V20C17 21.1046 16.1046 22 15 22H9C7.89543 22 7 21.1046 7 20V16H6C4.89543 16 4 15.1046 4 14V8C4 6.89543 4.89543 6 6 6H7V4ZM9 4V6H15V4H9ZM7 8H6V14H7V8ZM9 8V20H15V8H9ZM17 8V14H18V8H17Z" fill="currentColor"/>
          </svg>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3ZM1 12C1 5.92487 5.92487 1 12 1C18.0751 1 23 5.92487 23 12C23 18.0751 18.0751 23 12 23C5.92487 23 1 18.0751 1 12Z" fill="currentColor"/>
            <path d="M12 7C11.4477 7 11 7.44772 11 8C11 8.55228 11.4477 9 12 9H12.01C12.5623 9 13.01 8.55228 13.01 8C13.01 7.44772 12.5623 7 12.01 7H12Z" fill="currentColor"/>
            <path d="M11 12C11 11.4477 11.4477 11 12 11C12.5523 11 13 11.4477 13 12V16C13 16.5523 12.5523 17 12 17C11.4477 17 11 16.5523 11 16V12Z" fill="currentColor"/>
          </svg>
        </Actions>
      </Header>
      
      <MessagesPanel 
        messages={messages} 
        currentUser={currentUser} 
        typingUsers={typingUsers}
        partnerName={partner.name}
      />
      
      <MessageInput onSendMessage={sendMessage} />
    </Container>
  );
};

export default Chat; 