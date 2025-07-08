// routes/messages.js
const express = require('express');
const jwtAuth = require('../middleware/jwtAuth');
const Message = require('../models/Message');
const Room = require('../models/Room');

const router = express.Router();

// Get messages for a room
router.get('/:roomId', jwtAuth, async (req, res) => {
  try {
    const { roomId } = req.params;
    let actualRoomId = roomId;
    
    // Handle DM room IDs that start with dm_
    // if (roomId.startsWith('dm_')) {
    //   actualRoomId = roomId.replace('dm_', '');
    // }
    
    // Check if user has access to this room
    const room = await Room.findById(actualRoomId);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    
    // Check if user is a member of the room
    const isMember = room.members.some(memberId => 
      memberId.toString() === req.user._id.toString()
    );
    
    if (!isMember && room.isPrivate) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    // Fetch messages
    const messages = await Message.find({ roomId: actualRoomId })
      .sort({ createdAt: 1 })
      .limit(100); // Limit to last 100 messages
    
    // Format messages for frontend
    const formattedMessages = messages.map(message => ({
      id: message._id,
      type: message.type || 'text', // Default to 'text' if type is not set
      url: message.url || '', // Default to empty string if no URL
      filename: message.filename || '', // Default to empty string if no filename
      roomId: roomId, // Return original roomId (with dm_ prefix if it was a DM)
      senderId: message.senderId,
      senderName: message.senderName,
      senderAvatar: message.senderAvatar,
      content: message.content,
      timestamp: message.createdAt,
      deleted: message.deleted || false
    }));
    
    res.json(formattedMessages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ message: 'Failed to fetch messages' });
  }
});

// Delete a message (admin only)
// Update your existing delete message route in your messages routes file
// routes/messages.js


// Delete a message (sender or room admin only)
router.delete('/:messageId', jwtAuth, async (req, res) => {
  try {
    const { messageId } = req.params;
    const currentUserId = req.user._id.toString();
    
    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    // Get the room to check admin status
    const room = await Room.findById(message.roomId);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    // Check if user can delete the message
    const isMessageSender = message.senderId.toString() === currentUserId;
    const isRoomAdmin = room.admins.some(admin => 
      admin._id ? admin._id.toString() === currentUserId : admin.toString() === currentUserId
    );
    const isGlobalAdmin = req.user.role === 'admin'; // Keep existing global admin check

    if (!isMessageSender && !isRoomAdmin && !isGlobalAdmin) {
      return res.status(403).json({ 
        message: 'You can only delete your own messages or need admin privileges' 
      });
    }

    // Mark message as deleted
    message.deleted = true;
    message.content = 'This message has been deleted';
    message.url = ''; // Clear URL if it was an attachment
    message.filename = ''; // Clear filename if it was an attachment
    await message.save();

    // Emit socket event for real-time update
    const io = req.app.get('io'); // Assuming you have io attached to app
    if (io) {
      const roomId = room._id.toString();
      io.to(roomId).emit('deleteMessage', {
        messageId: message._id,
        roomId: roomId,
        deletedBy: currentUserId
      });
    }

    res.json({ 
      message: 'Message deleted successfully',
      messageId: message._id 
    });
  } catch (error) {
    console.error('Error deleting message:', error);
    res.status(500).json({ message: 'Failed to delete message' });
  }
});
// Get message history with pagination
router.get('/:roomId/history', jwtAuth, async (req, res) => {
  try {
    const { roomId } = req.params;
    const { page = 1, limit = 50 } = req.query;
    
    let actualRoomId = roomId;
    // if (roomId.startsWith('dm_')) {
    //   actualRoomId = roomId.replace('dm_', '');
    // }
    
    // Check room access
    const room = await Room.findById(actualRoomId);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    
    const isMember = room.members.some(memberId => 
      memberId.toString() === req.user._id.toString()
    );
    
    if (!isMember && room.isPrivate) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const messages = await Message.find({ roomId: actualRoomId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await Message.countDocuments({ roomId: actualRoomId });
    
    const formattedMessages = messages.reverse().map(message => ({
      id: message._id,
      roomId: roomId,
      senderId: message.senderId,
      senderName: message.senderName,
      senderAvatar: message.senderAvatar,
      content: message.content,
      timestamp: message.createdAt,
      deleted: message.deleted || false
    }));
    
    res.json({
      messages: formattedMessages,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalMessages: total,
        hasMore: skip + messages.length < total
      }
    });
  } catch (error) {
    console.error('Error fetching message history:', error);
    res.status(500).json({ message: 'Failed to fetch message history' });
  }
});

module.exports = router;