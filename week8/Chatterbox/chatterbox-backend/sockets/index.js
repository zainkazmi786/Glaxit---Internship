// sockets/index.js
const socketAuth = require('../middleware/socketAuth');
const Message = require('../models/Message');
const Room = require('../models/Room');
const User = require('../models/User');
const { sendToGemini } = require('../utils/helpers');
const mongoose = require('mongoose');



// Online users tracking
const onlineUsers = new Map();
const onlineUsersByRoom = new Map();

module.exports = (io) => {
  // Socket authentication middleware
  io.use(socketAuth);

  io.on('connection', async (socket) => {
    const user = socket.user;
    console.log(`👤 User connected: ${user.name} (${socket.id})`);

    // Add user to online users
    onlineUsers.set(user._id.toString(), {
      socketId: socket.id,
      user: user
    });

    // Update user online status
    await User.findByIdAndUpdate(user._id, { online: true });

    // Emit user online status to all connected clients
    socket.broadcast.emit('userOnline', {
      userId: user._id,
      user: {
        id: user._id,
        name: user.name,
        avatar: user.avatar
      }
    });
    socket.emit('onlineUsersList', Array.from(onlineUsers.values()));

    // Join Room Event
    socket.on('joinRoom', async (data) => {
      try {
        const { roomId } = data;

        // DM room logic
        if (roomId.startsWith('dm_')) {
          socket.join(roomId);

          // Add to onlineUsersByRoom
          if (!onlineUsersByRoom.has(roomId)) {
            onlineUsersByRoom.set(roomId, new Set());
          }
          onlineUsersByRoom.get(roomId).add(user._id.toString());

          socket.emit('joinedRoom', { roomId, type: 'dm' });

          // Notify other DM participant
          socket.to(roomId).emit('userOnline', {
            roomId,
            userId: user._id,
            user: { name: user.name, avatar: user.avatar }
          });

          return;
        }

        // Normal room logic
        const room = await Room.findById(roomId);
        if (!room) {
          socket.emit('error', { message: 'Room not found' });
          return;
        }

        // Access control for private room
        const isMember = room.members.some((memberId) =>
          memberId.toString() === user._id.toString()
        );

        if (room.isPrivate && !isMember) {
          socket.emit('error', { message: 'Access denied to private room' });
          return;
        }

        // Join the room
        socket.join(roomId);

        // Track online users
        if (!onlineUsersByRoom.has(roomId)) {
          onlineUsersByRoom.set(roomId, new Set());
        }
        onlineUsersByRoom.get(roomId).add(user._id.toString());

        // Notify this user and others
        socket.emit('joinedRoom', { roomId, type: 'room', room });

        socket.to(roomId).emit('userJoinedRoom', {
          user: {
            id: user._id,
            name: user.name,
            avatar: user.avatar
          },
          roomId
        });

        io.to(roomId).emit('userOnline', {
          roomId,
          userId: user._id,
          user: {
            name: user.name,
            avatar: user.avatar
          }
        });

      } catch (error) {
        console.error('Join room error:', error);
        socket.emit('error', { message: 'Failed to join room' });
      }
    });

    // Leave Room Event
    socket.on('leaveRoom', ({ roomId }) => {
      socket.leave(roomId);
      const userSet = onlineUsersByRoom.get(roomId);
      if (userSet) {
        userSet.delete(user._id.toString());

        io.to(roomId).emit('userOffline', {
          roomId,
          userId: user._id
        });

        // Clean up empty room
        if (userSet.size === 0) {
          onlineUsersByRoom.delete(roomId);
        }
      }
    });

    socket.on('sendMessage', async (data) => {
      try {
        const { roomId, content, type = 'text', url, filename } = data;
        const room = await Room.findById(roomId);
        if (room.isAi) {
          // Save user message to DB
          const userMsg = new Message({
            roomId,
            senderId: user._id,
            senderName: user.name,
            senderAvatar: user.avatar,
            content,
            type: 'text',
            timestamp: new Date()
          });
          await userMsg.save();
          const formatMessage = (message) => ({
              id: message._id,
              roomId: message.roomId,
              senderId: message.senderId,
              senderName: message.senderName || 'Gemini',
              senderAvatar: message.senderAvatar || '/ai-avatar.png', // placeholder avatar for AI
              content: message.content,
              timestamp: message.createdAt,
              type: message.type || 'text',
              status: 'sent'
            });

          io.to(roomId).emit('receiveMessage', formatMessage(userMsg));

          // 💡 Now send to Gemini API
          const aiReply = await sendToGemini(content);

          // Save AI reply
          const aiMsg = new Message({
            roomId,
            senderId: new mongoose.Types.ObjectId('64b0ee2c189286a5abc6b4ba'), // or some 'AI' system user
            senderAvatar: '/gemini-icon-seeklogo.svg', // placeholder avatar for AI
            senderName: 'Gemini',
            content: aiReply,
            type: 'text',
            timestamp: new Date()
          });
          await aiMsg.save();

          io.to(roomId).emit('receiveMessage', formatMessage(aiMsg));
          return;
        }
        

        // Validate based on message type
        if (type === 'text' && (!content || content.trim().length === 0)) {
          socket.emit('error', { message: 'Message content cannot be empty' });
          return;
        }

        const messagePayload = {
          roomId: roomId.startsWith('dm_') ? roomId.replace('dm_', '') : roomId,
          senderId: user._id,
          senderName: user.name,
          senderAvatar: user.avatar,
          timestamp: new Date(),
          type
        };

        // Set content depending on message type
        
        messagePayload.content = content.trim() || '';
      
        messagePayload.url = url || '';
        messagePayload.filename = filename || '';
        

        // Save to DB
        const message = new Message(messagePayload);
        await message.save();

        const messageData = {
          id: message._id,
          roomId,
          senderId: user._id,
          senderName: user.name,
          senderAvatar: user.avatar,
          timestamp: message.createdAt,
          type,
          content: message.content,
          url: message.url,
          filename: message.filename,
          status: 'sent'
        };

        // Emit message
        io.to(roomId).emit('receiveMessage', messageData);

        // Only update regular room's last activity
        // if (!roomId.startsWith('dm_')) {
        //   await Room.findByIdAndUpdate(roomId, { updatedAt: new Date() });
        // }

      } catch (error) {
        console.error('Send message error:', error);
        socket.emit('error', { message: 'Failed to send message' });
      }
    });


    // Typing indicators
    socket.on('typing', (data) => {
      const { roomId } = data;
      socket.to(roomId).emit('typing', {
        userId: user._id,
        userName: user.name,
        roomId
      });
    });

    socket.on('stopTyping', (data) => {
      const { roomId } = data;
      socket.to(roomId).emit('stopTyping', {
        userId: user._id,
        userName: user.name,
        roomId
      });
    });

    // Admin Controls
    socket.on('kickUser', async (data) => {
      try {
        if (user.role !== 'admin') {
          socket.emit('error', { message: 'Permission denied' });
          return;
        }

        const { userId, roomId } = data;

        // Find the user's socket and disconnect them from the room
        const targetUser = Array.from(onlineUsers.values())
          .find(u => u.user._id.toString() === userId);

        if (targetUser) {
          const targetSocket = io.sockets.sockets.get(targetUser.socketId);
          if (targetSocket) {
            targetSocket.leave(roomId);
            targetSocket.emit('kickedFromRoom', { roomId, reason: 'Kicked by admin' });
          }
        }

        // Remove from room members
        await Room.findByIdAndUpdate(roomId, {
          $pull: { members: userId }
        });

        // Notify room
        io.to(roomId).emit('userKicked', { userId, roomId });

      } catch (error) {
        console.error('Kick user error:', error);
        socket.emit('error', { message: 'Failed to kick user' });
      }
    });

    socket.on('deleteMessage', async (data) => {
      try {
        const { messageId, roomId } = data;
        const currentUserId = user._id.toString();
        const message = await Message.findById(messageId);
        if (!message) {
          socket.emit('error', { message: 'Message not found' });
          return;
        }
        const room = await Room.findById(message.roomId);
        if (!room) {
          socket.emit('error', { message: 'Room not found' });
          return;
        }
        const isMessageSender = message.senderId.toString() === user._id.toString();
        const isRoomAdmin = room.admins.some(admin =>
          admin._id ? admin._id.toString() === currentUserId : admin.toString() === currentUserId
        );
        const isGlobalAdmin = user.role === 'admin'; // Keep existing global admin check

        if (!isMessageSender && !isRoomAdmin && !isGlobalAdmin) {
          return socket.emit('error', {
            message: 'You can only delete your own messages or need admin privileges'
          });
        }
        message.deleted = true;
        message.content = 'This message has been deleted';
        message.url = ''; // Clear URL if it was an attachment
        message.filename = ''; // Clear filename if it was an attachment
        await message.save();

        // Notify room about deleted message
        io.to(roomId).emit('messageDeleted', { messageId, roomId });

      } catch (error) {
        console.error('Delete message error:', error);
        socket.emit('error', { message: 'Failed to delete message' });
      }
    });

    // Handle disconnect
    socket.on('disconnect', async () => {
      console.log(`👤 User disconnected: ${user.name} (${socket.id})`);

      // Remove from online users
      onlineUsers.delete(user._id.toString());

      // Remove from all room tracking
      for (const [roomId, userSet] of onlineUsersByRoom.entries()) {
        if (userSet.has(user._id.toString())) {
          userSet.delete(user._id.toString());

          // Notify room users
          io.to(roomId).emit('userOffline', {
            roomId,
            userId: user._id
          });

          // Clean up empty rooms
          if (userSet.size === 0) {
            onlineUsersByRoom.delete(roomId);
          }
        }
      }

      // Update user offline status
      await User.findByIdAndUpdate(user._id, { online: false });

      // Emit user offline status
      socket.broadcast.emit('userOffline', {
        userId: user._id
      });
    });
  });
};