const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// In-memory data store (in a real app, use a database)
const users = {};
const conversations = {};
const messages = {};
const onlineUsers = new Set();

// Helper to get or create a conversation between users
const getConversationId = (user1, user2) => {
  const ids = [user1, user2].sort();
  return `${ids[0]}_${ids[1]}`;
};

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  
  // User connects
  socket.on('user-connected', (userId) => {
    console.log(`User ${userId} connected`);
    socket.userId = userId;
    onlineUsers.add(userId);
    
    // Add or update user in our in-memory store
    if (!users[userId]) {
      users[userId] = {
        id: userId,
        socketId: socket.id
      };
    } else {
      users[userId].socketId = socket.id;
    }
    
    // Send user their conversations
    const userConversations = {};
    Object.keys(conversations)
      .filter(id => id.includes(userId))
      .forEach(id => {
        userConversations[id] = messages[id] || [];
      });
    
    socket.emit('conversations', userConversations);
    
    // Broadcast online users
    io.emit('users-online', Array.from(onlineUsers));
  });
  
  // Join a conversation
  socket.on('join-conversation', (conversationId) => {
    socket.join(conversationId);
    
    // Send message history
    socket.emit('message-history', {
      conversationId,
      messages: messages[conversationId] || []
    });
  });
  
  // Send a message
  socket.on('send-message', ({ conversationId, message }) => {
    const newMessage = {
      id: uuidv4(),
      text: message.text,
      sender: socket.userId,
      timestamp: message.timestamp || new Date().toISOString(),
      status: 'sent'
    };
    
    // Create conversation if it doesn't exist
    if (!conversations[conversationId]) {
      const participants = conversationId.split('_');
      conversations[conversationId] = {
        id: conversationId,
        participants
      };
    }
    
    // Initialize messages array if needed
    if (!messages[conversationId]) {
      messages[conversationId] = [];
    }
    
    // Add message to history
    messages[conversationId].push(newMessage);
    
    // Broadcast to everyone in the conversation
    io.to(conversationId).emit('new-message', {
      conversationId,
      message: newMessage
    });
    
    // Update to delivered for other users in the conversation
    const participants = conversationId.split('_');
    participants.forEach(participantId => {
      if (participantId !== socket.userId && onlineUsers.has(participantId)) {
        // If recipient is online, mark as delivered
        const updatedMessage = { ...newMessage, status: 'delivered' };
        io.to(users[participantId]?.socketId).emit('message-status-updated', {
          conversationId,
          messageId: newMessage.id,
          status: 'delivered'
        });
      }
    });
  });
  
  // Message seen
  socket.on('message-seen', ({ conversationId, messageId }) => {
    if (!messages[conversationId]) return;
    
    // Update message status in our store
    const message = messages[conversationId].find(msg => msg.id === messageId);
    if (message) {
      message.status = 'seen';
      
      // Notify the sender
      const sender = message.sender;
      if (sender !== socket.userId && users[sender]) {
        io.to(users[sender].socketId).emit('message-status-updated', {
          conversationId,
          messageId,
          status: 'seen'
        });
      }
    }
  });
  
  // Typing indicator
  socket.on('typing', ({ conversationId, isTyping }) => {
    socket.to(conversationId).emit('user-typing', {
      conversationId,
      user: socket.userId,
      isTyping
    });
  });
  
  // Disconnect
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    if (socket.userId) {
      onlineUsers.delete(socket.userId);
      
      // Broadcast updated online users
      io.emit('users-online', Array.from(onlineUsers));
    }
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 