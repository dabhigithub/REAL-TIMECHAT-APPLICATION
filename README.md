# Modern Real-Time Chat Application

*COMPANY*: CODTECH IT SOLUTIONS

*NAME*: ABHISHEK KUMAR

*INTERN ID*: CT08WSD

*DOMAIN*: FRONTEND WEB DEVELOPMENT

*DURATION*: 4 WEEKS 

*MENTOR*: NEELA SANTOSH

***********************************************************************************************************************************************

# Modern Real-Time Chat Application
![APP HOMEPAGE](https://github.com/dabhigithub/REAL-TIMECHAT-APPLICATION/blob/8e9c9d882540d70dd87e552f8a6904c9009e971f/screenshort/chat%20pic.png)

A feature-rich, responsive real-time chat application built with React, TypeScript, Socket.IO, and styled-components featuring a modern UI design with both light and dark mode support.

## Features

- 🎨 **Modern UI** - Clean, intuitive interface with light and dark mode
- 💬 **Real-time messaging** - Instant message delivery using Socket.IO
- 🔔 **Message status indicators** - Sent, delivered, and read receipts
- ✍️ **Typing indicators** - See when someone is typing a response
- 👤 **Online status** - Know when your contacts are online
- 📱 **Responsive design** - Works on desktop, tablet, and mobile devices
- 🔄 **Conversation management** - Support for multiple conversations
- 🔍 **Search functionality** - Find conversations quickly
- 🌐 **Avatar generation** - Unique avatars for each user

## Tech Stack

- **Frontend**:
  - React with TypeScript
  - styled-components for theming and styling
  - Socket.IO client for real-time communication
  - Axios for HTTP requests

- **Backend**:
  - Node.js with Express
  - Socket.IO for real-time event handling
  - In-memory data storage (easily extendable for database integration)

## Getting Started

### Prerequisites

- Node.js (v14+)
- npm or yarn

### Installation and Setup

1. Clone the repository (or download and extract the zip file)

2. Install client dependencies:

```bash
cd chat-app
npm install
```

3. Install server dependencies:

```bash
cd server
npm install
```

### Running the Application

#### On Windows:

1. Start the server:
```bash
cd chat-app/server
npm run start
```

2. In a new terminal window, start the client:
```bash
cd chat-app
npm run start
```

3. Open your browser and navigate to `http://localhost:3000`

Note: If port 3000 is already in use, React will automatically suggest an alternative port.

## Using the Application

### First-time Setup

- When you first open the app, you'll be assigned a random user for demo purposes
- Sample conversations are pre-loaded to demonstrate functionality

### Key Features Usage

- **Sending Messages**: Type in the message input field and press Enter or click the send icon
- **New Conversation**: Click the "+" button in the bottom right to start a new conversation
- **Toggle Theme**: Click the sun/moon icon in the header to switch between light and dark mode
- **Search**: Use the search field at the top of the conversations list to find specific chats
- **View Message Status**: Sent messages show status indicators (single check for sent, double checks for delivered/read)

## Project Structure

```
chat-app/
├── public/
├── src/
│   ├── components/
│   │   ├── Chat/
│   │   ├── ConversationList/
│   │   ├── MessageBubble/
│   │   ├── MessageInput/
│   │   ├── MessageList/
│   │   ├── MessagesPanel/
│   │   └── types.ts
│   ├── App.tsx
│   ├── index.tsx
│   └── ...
└── package.json

server/
├── data/
├── routes/
├── index.js
└── package.json
```

## Extending the Application

This application can be extended in several ways:

- **Authentication**: Implement user registration and login
- **Data Persistence**: Integrate with a database (MongoDB, PostgreSQL, etc.)
- **File Sharing**: Add support for sending images, files, and media
- **Group Chats**: Implement multi-user conversation functionality
- **Push Notifications**: Add browser or mobile notifications
- **End-to-End Encryption**: Implement message encryption for privacy
- **Video/Audio Calling**: Add WebRTC-based call functionality

## Troubleshooting

- **Port Conflicts**: If port 3000 or 5000 is already in use, you can change the ports in the respective configuration files
- **Connection Issues**: Ensure both server and client are running simultaneously
- **CORS Issues**: Make sure the server's CORS settings allow connections from the client's origin

## License

This project is licensed under the MIT License

## Acknowledgments

- [styled-components](https://styled-components.com/)
- [Socket.IO](https://socket.io/)
- [DiceBear Avatars](https://avatars.dicebear.com/) for the avatar generation
