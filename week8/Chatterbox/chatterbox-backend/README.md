
// README.md
# ChatterBox Backend

A real-time chat application backend built with Node.js, Express, Socket.IO, and MongoDB.

## Features

- 🔐 Google OAuth authentication
- 🔒 JWT-secured API and Socket.IO connections
- 💬 Real-time messaging with Socket.IO
- 🏠 Public and private rooms
- 📱 Direct messaging
- 👥 Online/offline presence tracking
- 📊 Message persistence with MongoDB
- 🛡️ Admin moderation controls
- 📡 Typing indicators

## Setup Instructions

1. **Clone and Install**
   ```bash
   git clone <repository-url>
   cd chatterbox-backend
   npm install
   ```

2. **Environment Variables**
   - Copy `.env.example` to `.env`
   - Fill in your configuration values:
     - MongoDB connection string
     - Google OAuth credentials
     - JWT secret key
     - Client URL for CORS

3. **Google OAuth Setup**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing
   - Enable Google+ API
   - Create OAuth 2.0 credentials
   - Add authorized redirect URIs: `http://localhost:5000/auth/google/callback`

4. **Start the Server**
   ```bash
   # Development
   npm run dev
   
   # Production
   npm start
   ```

## API Endpoints

### Authentication
- `GET /auth/google` - Initiate Google OAuth
- `GET /auth/google/callback` - OAuth callback
- `GET /auth/me` - Get current user
- `POST /auth/logout` - Logout user

### Rooms
- `GET /api/rooms/public` - Get public rooms
- `GET /api/rooms/my-rooms` - Get user's rooms
- `POST /api/rooms/create` - Create new room
- `POST /api/rooms/join/:inviteCode` - Join private room

### Messages
- `GET /api/messages/:roomId` - Get room messages (paginated)
- `DELETE /api/messages/:messageId` - Delete message (admin/owner)

## Socket.IO Events

### Client to Server
- `joinRoom` - Join a room
- `sendMessage` - Send message
- `typing` - Start typing indicator
- `stopTyping` - Stop typing indicator
- `kickUser` - Kick user (admin only)
- `deleteMessage` - Delete message (admin only)

### Server to Client
- `receiveMessage` - New message received
- `userOnline` - User came online
- `userOffline` - User went offline
- `typing` - User is typing
- `stopTyping` - User stopped typing
- `userJoinedRoom` - User joined room
- `userKicked` - User was kicked
- `messageDeleted` - Message was deleted

## Database Schema

### User
- `googleId` - Google OAuth ID
- `name` - User display name
- `email` - User email
- `avatar` - Profile picture URL
- `role` - user/admin
- `online` - Online status

### Room
- `name` - Room name
- `isPrivate` - Privacy setting
- `inviteCode` - Private room invite code
- `members` - Array of user IDs
- `admins` - Array of admin user IDs
- `creator` - Room creator ID

### Message
- `roomId` - Room/DM identifier
- `senderId` - Message sender ID
- `senderName` - Sender display name
- `content` - Message content
- `status` - sent/delivered/seen
- `type` - text/image/file
- `deleted` - Deletion status

## Architecture

```
├── config/          # Database and Passport configuration
├── controllers/     # Route controllers
├── middleware/      # Authentication middleware
├── models/          # MongoDB schemas
├── routes/          # Express routes
├── sockets/         # Socket.IO event handlers
├── utils/           # Helper functions
├── app.js           # Express app setup
└── server.js        # Server entry point
```

## Security Features

- JWT authentication for API and Socket.IO
- Google OAuth for secure login
- Input validation and sanitization
- CORS configuration
- Session management
- Admin role-based permissions

## Scaling Considerations

- Redis adapter for Socket.IO (multi-server)
- Message pagination
- Connection pooling
- Rate limiting
- Clustering support

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# The server will restart automatically on file changes
```
