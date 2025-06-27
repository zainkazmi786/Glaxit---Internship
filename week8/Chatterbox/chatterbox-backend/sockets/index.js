// sockets/index.js
const socketAuth = require('../middleware/socketAuth');
const Message = require('../models/Message');
const Room = require('../models/Room');
const User = require('../models/User');

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

    // Send Message Event
    socket.on('sendMessage', async (data) => {
      try {
        const { roomId, content } = data;
        
        if (!content || content.trim().length === 0) {
          socket.emit('error', { message: 'Message content cannot be empty' });
          return;
        }

        // Handle DM messages
        if (roomId.startsWith('dm_')) {
          // Extract actual room ID from dm_ prefix
          const actualRoomId = roomId.replace('dm_', '');
          
          const message = new Message({
            roomId: actualRoomId,
            senderId: user._id,
            senderName: user.name,
            content: content.trim(),
            timestamp: new Date()
          });

          await message.save();

          const messageData = {
            id: message._id,
            roomId: roomId, // Keep the dm_ prefix for frontend
            senderId: user._id,
            senderName: user.name,
            senderAvatar: user.avatar,
            content: message.content,
            timestamp: message.createdAt,
            status: 'sent',
            type: 'text'
          };

          // Emit to all users in the DM room
          io.to(roomId).emit('receiveMessage', messageData);
          return;
        }

        // Regular room message
        const message = new Message({
          roomId,
          senderId: user._id,
          senderName: user.name,
          content: content.trim(),
          timestamp: new Date()
        });

        await message.save();

        const messageData = {
          id: message._id,
          roomId,
          senderId: user._id,
          senderName: user.name,
          senderAvatar: user.avatar,
          content: message.content,
          timestamp: message.createdAt,
          status: 'sent',
          type: 'text'
        };

        // Emit to all users in the room
        io.to(roomId).emit('receiveMessage', messageData);

        // Update room's last activity
        await Room.findByIdAndUpdate(roomId, { updatedAt: new Date() });

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
          return ;
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