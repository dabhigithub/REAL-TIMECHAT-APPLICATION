import React, { useState, useEffect } from 'react';
import styled, { ThemeProvider, createGlobalStyle } from 'styled-components';
import Chat from './components/Chat';
import ConversationList from './components/ConversationList';
import { Conversation, Message, User, lightTheme, darkTheme } from './components/types';
import axios from 'axios';
import io from 'socket.io-client';
import './App.css';

// Initialize socket connection
const socket = io('http://localhost:5000');

const GlobalStyle = createGlobalStyle<{ theme: any }>`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  }
  
  body {
    background-color: ${props => props.theme.background};
    color: ${props => props.theme.text};
    height: 100vh;
    transition: all 0.3s ease;
  }
  
  #root {
    height: 100vh;
  }
`;

const AppContainer = styled.div`
  display: flex;
  height: 100vh;
  overflow: hidden;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const LoadingContainer = styled.div<{ theme: any }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: ${props => props.theme.background};
  color: ${props => props.theme.text};
`;

const Spinner = styled.div`
  border: 4px solid ${props => props.theme.secondary}50;
  border-top: 4px solid ${props => props.theme.primary};
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [conversations, setConversations] = useState<Record<string, Conversation>>({});
  const [activeConversation, setActiveConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<Record<string, Message[]>>({});
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(() => {
    // Check for saved preference or use system preference
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode !== null) {
      return savedMode === 'true';
    }
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  
  const theme = darkMode ? darkTheme : lightTheme;
  
  // Toggle theme function
  const toggleTheme = () => {
    setDarkMode(!darkMode);
    localStorage.setItem('darkMode', String(!darkMode));
  };
  
  // Login user
  useEffect(() => {
    const loginUser = async () => {
      try {
        // For demonstration we'll use a dummy user, but in a real app
        // this would be a proper login workflow
        const userData: User = {
          id: `user_${Math.floor(Math.random() * 1000)}`,
          username: `user${Math.floor(Math.random() * 1000)}`,
          displayName: `User ${Math.floor(Math.random() * 1000)}`
        };
        
        setCurrentUser(userData);
        
        // Join as the current user
        socket.emit('user_connect', userData.id);
        
        // Get conversations (if this were a real app)
        // const response = await axios.get(`http://localhost:5000/api/conversations/${userData.id}`);
        // setConversations(response.data);
        
        // For demonstration, create sample conversations
        const sampleConversations: Record<string, Conversation> = {
          'conv_1': {
            id: 'conv_1',
            participants: [userData.id, 'user_101'],
            lastMessage: {
              id: 'msg_1',
              text: 'Hey there!',
              senderId: 'user_101',
              timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 mins ago
              delivered: true,
              read: true
            }
          },
          'conv_2': {
            id: 'conv_2',
            participants: [userData.id, 'user_102'],
            lastMessage: {
              id: 'msg_2',
              text: 'Can we schedule a meeting tomorrow?',
              senderId: userData.id,
              timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 mins ago
              delivered: true,
              read: false
            },
            unreadCount: 3
          },
          'conv_3': {
            id: 'conv_3',
            participants: [userData.id, 'user_103'],
            lastMessage: {
              id: 'msg_3',
              text: 'Did you see the latest update?',
              senderId: 'user_103',
              timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
              delivered: true,
              read: true
            }
          }
        };
        
        setConversations(sampleConversations);
        
        // Add sample messages for each conversation
        const sampleMessages: Record<string, Message[]> = {
          'conv_1': [
            {
              id: 'msg_1_1',
              text: 'Hi there!',
              senderId: 'user_101',
              timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
              delivered: true,
              read: true
            },
            {
              id: 'msg_1_2',
              text: 'How are you doing today?',
              senderId: 'user_101',
              timestamp: new Date(Date.now() - 1000 * 60 * 59).toISOString(),
              delivered: true,
              read: true
            },
            {
              id: 'msg_1_3',
              text: "I'm good, thanks for asking! How about you?",
              senderId: userData.id,
              timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
              delivered: true,
              read: true
            },
            {
              id: 'msg_1_4',
              text: "I'm doing well too. Just wanted to catch up!",
              senderId: 'user_101',
              timestamp: new Date(Date.now() - 1000 * 60 * 40).toISOString(),
              delivered: true,
              read: true
            },
            {
              id: 'msg_1_5',
              text: 'Great to hear from you!',
              senderId: userData.id,
              timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
              delivered: true,
              read: true
            },
          ],
          'conv_2': [
            {
              id: 'msg_2_1',
              text: 'Hello! I was thinking about our project',
              senderId: 'user_102',
              timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
              delivered: true,
              read: true
            },
            {
              id: 'msg_2_2',
              text: 'I think we should meet to discuss the next steps',
              senderId: 'user_102',
              timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1.9).toISOString(),
              delivered: true,
              read: true
            },
            {
              id: 'msg_2_3',
              text: 'That sounds like a good idea',
              senderId: userData.id,
              timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1.8).toISOString(),
              delivered: true,
              read: true
            },
            {
              id: 'msg_2_4',
              text: 'Great! When are you available?',
              senderId: 'user_102',
              timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1.7).toISOString(),
              delivered: true,
              read: true
            },
            {
              id: 'msg_2_5',
              text: 'Can we schedule a meeting tomorrow?',
              senderId: userData.id,
              timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
              delivered: true,
              read: false
            },
          ],
          'conv_3': [
            {
              id: 'msg_3_1',
              text: 'Have you seen the news?',
              senderId: 'user_103',
              timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
              delivered: true,
              read: true
            },
            {
              id: 'msg_3_2',
              text: 'Which news are you talking about?',
              senderId: userData.id,
              timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2.9).toISOString(),
              delivered: true,
              read: true
            },
            {
              id: 'msg_3_3',
              text: 'The product update we were waiting for',
              senderId: 'user_103',
              timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2.8).toISOString(),
              delivered: true,
              read: true
            },
            {
              id: 'msg_3_4',
              text: 'Oh! Not yet. What does it include?',
              senderId: userData.id,
              timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2.7).toISOString(),
              delivered: true,
              read: true
            },
            {
              id: 'msg_3_5',
              text: 'Did you see the latest update?',
              senderId: 'user_103',
              timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
              delivered: true,
              read: true
            },
          ]
        };
        
        setMessages(sampleMessages);
        
        // Set online users
        setOnlineUsers(['user_101', 'user_103']);
        
        setLoading(false);
      } catch (error) {
        console.error('Login error:', error);
      }
    };
    
    loginUser();
    
    // Socket event listeners
    socket.on('user_connected', (userId: string) => {
      setOnlineUsers(prev => [...prev, userId]);
    });
    
    socket.on('user_disconnected', (userId: string) => {
      setOnlineUsers(prev => prev.filter(id => id !== userId));
    });
    
    socket.on('receive_message', (message: Message) => {
      const conversationId = Object.keys(conversations).find(id => {
        return conversations[id].participants.includes(message.senderId) && 
               conversations[id].participants.includes(currentUser?.id || '');
      });
      
      if (conversationId) {
        // Update messages
        setMessages(prev => ({
          ...prev,
          [conversationId]: [...(prev[conversationId] || []), message]
        }));
        
        // Update conversation's last message
        setConversations(prev => ({
          ...prev,
          [conversationId]: {
            ...prev[conversationId],
            lastMessage: message,
            unreadCount: (prev[conversationId].unreadCount || 0) + 1
          }
        }));
      }
    });
    
    socket.on('typing', ({ userId, conversationId }: { userId: string, conversationId: string }) => {
      if (activeConversation === conversationId) {
        setTypingUsers(prev => [...prev, userId]);
        
        // Clear typing indicator after 3 seconds
        setTimeout(() => {
          setTypingUsers(prev => prev.filter(id => id !== userId));
        }, 3000);
      }
    });
    
    // Cleanup on unmount
    return () => {
      socket.off('user_connected');
      socket.off('user_disconnected');
      socket.off('receive_message');
      socket.off('typing');
      
      if (currentUser) {
        socket.emit('user_disconnect', currentUser.id);
      }
    };
  }, []);
  
  // Handle selecting a conversation
  const handleSelectConversation = (conversationId: string) => {
    setActiveConversation(conversationId);
    
    // Reset unread count when selecting a conversation
    if (conversations[conversationId]?.unreadCount) {
      setConversations(prev => ({
        ...prev,
        [conversationId]: {
          ...prev[conversationId],
          unreadCount: 0
        }
      }));
    }
  };
  
  // Handle sending a message
  const handleSendMessage = (text: string) => {
    if (!currentUser || !activeConversation) return;
    
    const newMessage: Message = {
      id: `msg_${Date.now()}`,
      text,
      senderId: currentUser.id,
      timestamp: new Date().toISOString(),
      delivered: false,
      read: false
    };
    
    // Update local state immediately for responsiveness
    setMessages(prev => ({
      ...prev,
      [activeConversation]: [...(prev[activeConversation] || []), newMessage]
    }));
    
    // Update conversation with last message
    setConversations(prev => ({
      ...prev,
      [activeConversation]: {
        ...prev[activeConversation],
        lastMessage: newMessage
      }
    }));
    
    // Send message to the server via socket
    socket.emit('send_message', {
      message: newMessage,
      conversationId: activeConversation
    });
    
    // Simulate message being delivered
    setTimeout(() => {
      setMessages(prev => {
        const conversationMessages = [...prev[activeConversation]];
        const msgIndex = conversationMessages.findIndex(msg => msg.id === newMessage.id);
        
        if (msgIndex !== -1) {
          conversationMessages[msgIndex] = { 
            ...conversationMessages[msgIndex], 
            delivered: true 
          };
        }
        
        return {
          ...prev,
          [activeConversation]: conversationMessages
        };
      });
      
      // Update the last message in the conversation
      setConversations(prev => ({
        ...prev,
        [activeConversation]: {
          ...prev[activeConversation],
          lastMessage: {
            ...prev[activeConversation].lastMessage!,
            delivered: true
          }
        }
      }));
    }, 1000);
    
    // Simulate message being read after 2 seconds
    setTimeout(() => {
      setMessages(prev => {
        const conversationMessages = [...prev[activeConversation]];
        const msgIndex = conversationMessages.findIndex(msg => msg.id === newMessage.id);
        
        if (msgIndex !== -1) {
          conversationMessages[msgIndex] = { 
            ...conversationMessages[msgIndex], 
            read: true 
          };
        }
        
        return {
          ...prev,
          [activeConversation]: conversationMessages
        };
      });
      
      // Update the last message in the conversation
      setConversations(prev => ({
        ...prev,
        [activeConversation]: {
          ...prev[activeConversation],
          lastMessage: {
            ...prev[activeConversation].lastMessage!,
            read: true
          }
        }
      }));
    }, 2000);
  };
  
  if (loading) {
    return (
      <ThemeProvider theme={theme}>
        <GlobalStyle theme={theme} />
        <LoadingContainer theme={theme}>
          <Spinner />
          <h2>Loading Chat...</h2>
        </LoadingContainer>
      </ThemeProvider>
    );
  }
  
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle theme={theme} />
      <AppContainer>
        {currentUser && (
          <>
            <ConversationList
              conversations={conversations}
              currentUser={currentUser}
              onSelectConversation={handleSelectConversation}
              activeConversation={activeConversation}
              onlineUsers={onlineUsers}
              darkMode={darkMode}
              toggleTheme={toggleTheme}
            />
            <Chat
              conversation={activeConversation ? conversations[activeConversation] : null}
              currentUser={currentUser}
              messages={activeConversation ? messages[activeConversation] || [] : []}
              sendMessage={handleSendMessage}
              typingUsers={typingUsers}
              darkMode={darkMode}
              toggleTheme={toggleTheme}
            />
          </>
        )}
      </AppContainer>
    </ThemeProvider>
  );
};

export default App;
