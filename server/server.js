const express = require('express');
const http = require('http');
const cors = require('cors');
const socketIo = require('socket.io');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Data storage paths
const DATA_DIR = path.join(__dirname, 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const MESSAGES_FILE = path.join(DATA_DIR, 'messages.json');

// Create data directory if it doesn't exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initialize empty data files if they don't exist
if (!fs.existsSync(USERS_FILE)) {
  fs.writeFileSync(USERS_FILE, JSON.stringify([]));
}
if (!fs.existsSync(MESSAGES_FILE)) {
  fs.writeFileSync(MESSAGES_FILE, JSON.stringify({}));
}

// Load data from files
let users = [];
let conversations = {};

try {
  users = JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));
  conversations = JSON.parse(fs.readFileSync(MESSAGES_FILE, 'utf8'));
} catch (error) {
  console.error('Error loading data:', error);
}

// Save data to files
const saveData = () => {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users));
  fs.writeFileSync(MESSAGES_FILE, JSON.stringify(conversations));
};

// API routes
app.post('/api/users/register', (req, res) => {
  const { username, password, displayName, avatar } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }
  
  // Check if username already exists
  if (users.find(user => user.username === username)) {
    return res.status(409).json({ error: 'Username already exists' });
  }
  
  const newUser = {
    id: Date.now().toString(),
    username,
    password, // In a real app, you should hash the password
    displayName: displayName || username,
    avatar: avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(username)}`,
    status: 'Hey there! I am using WhatsApp',
    createdAt: new Date().toISOString()
  };
  
  users.push(newUser);
  saveData();
  
  // Don't return the password in the response
  const { password: _, ...userWithoutPassword } = newUser;
  res.status(201).json(userWithoutPassword);
});

app.post('/api/users/login', (req, res) => {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }
  
  const user = users.find(user => user.username === username && user.password === password);
  
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  
  // Don't return the password in the response
  const { password: _, ...userWithoutPassword } = user;
  res.json(userWithoutPassword);
});

app.get('/api/users', (req, res) => {
  // Return all users without passwords
  const usersWithoutPasswords = users.map(({ password, ...user }) => user);
  res.json(usersWithoutPasswords);
});

// Socket.IO
const onlineUsers = new Map();

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);
  
  socket.on('user-connected', (userId) => {
    onlineUsers.set(socket.id, userId);
    io.emit('users-online', Array.from(onlineUsers.values()));
    
    // Send conversation list to the user
    const userConversations = Object.keys(conversations)
      .filter(key => key.includes(userId))
      .reduce((acc, key) => {
        acc[key] = conversations[key];
        return acc;
      }, {});
    
    socket.emit('conversations', userConversations);
  });
  
  socket.on('join-conversation', (conversationId) => {
    socket.join(conversationId);
    
    // Send conversation history
    const history = conversations[conversationId] || [];
    socket.emit('message-history', { conversationId, messages: history });
  });
  
  socket.on('send-message', (data) => {
    const { conversationId, message } = data;
    
    if (!conversationId || !message) return;
    
    // Create the conversation if it doesn't exist
    if (!conversations[conversationId]) {
      conversations[conversationId] = [];
    }
    
    const newMessage = {
      id: Date.now().toString(),
      sender: onlineUsers.get(socket.id),
      text: message.text,
      timestamp: new Date().toISOString(),
      status: 'sent'
    };
    
    conversations[conversationId].push(newMessage);
    saveData();
    
    // Broadcast to all clients in the conversation
    io.to(conversationId).emit('new-message', { conversationId, message: newMessage });
  });
  
  socket.on('typing', (data) => {
    const { conversationId, isTyping } = data;
    const userId = onlineUsers.get(socket.id);
    
    socket.to(conversationId).emit('user-typing', { 
      conversationId, 
      user: userId, 
      isTyping 
    });
  });
  
  socket.on('message-seen', (data) => {
    const { conversationId, messageId } = data;
    
    if (conversations[conversationId]) {
      const messageIndex = conversations[conversationId].findIndex(m => m.id === messageId);
      
      if (messageIndex !== -1) {
        conversations[conversationId][messageIndex].status = 'seen';
        saveData();
        
        io.to(conversationId).emit('message-status-updated', {
          conversationId,
          messageId,
          status: 'seen'
        });
      }
    }
  });
  
  socket.on('disconnect', () => {
    const userId = onlineUsers.get(socket.id);
    onlineUsers.delete(socket.id);
    io.emit('users-online', Array.from(onlineUsers.values()));
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 