
// routes/rooms.js
const express = require('express');
const jwtAuth = require('../middleware/jwtAuth');
const Room = require('../models/Room');
const { generateInviteCode } = require('../utils/helpers');

const router = express.Router();

// Get public rooms
router.get('/public', jwtAuth, async (req, res) => {
  try {
    const rooms = await Room.find({ isPrivate: false })
      .populate('creator', 'name avatar')
      .populate('members', 'name avatar')
      .populate('admins', 'name avatar')
      .sort({ createdAt: -1 });
    
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's rooms
router.get('/my-rooms', jwtAuth, async (req, res) => {
  try {
    const rooms = await Room.find({ 
      members: req.user._id 
    })
    .populate('creator', 'name avatar')
    .populate('members', 'name avatar')
    .populate('admins', 'name avatar')
    .sort({ updatedAt: -1 });
    
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create room
router.post('/create', jwtAuth, async (req, res) => {
  try {
    const { name, isPrivate } = req.body;
    
    if (!name || name.trim().length === 0) {
      return res.status(400).json({ message: 'Room name is required' });
    }

    const roomData = {
      name: name.trim(),
      isPrivate: Boolean(isPrivate),
      creator: req.user._id,
      members: [req.user._id],
      admins: [req.user._id]
    };

    if (isPrivate) {
      roomData.inviteCode = generateInviteCode();
    }

    const room = new Room(roomData);
    await room.save();
    
    const populatedRoom = await Room.findById(room._id)
      .populate('creator', 'name avatar')
      .populate('members', 'name avatar');

    res.status(201).json(populatedRoom);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create or return existing DM room between two users
router.post('/dm/:userId', jwtAuth, async (req, res) => {
  const { userId } = req.params;
  const currentUserId = req.user._id.toString();

  if (userId === currentUserId) {
    return res.status(400).json({ message: "You cannot DM yourself." });
  }

  // Create deterministic room name/id by sorting both user IDs
  const members = [currentUserId, userId].sort();

  try {
    // Check if DM already exists
    let room = await Room.findOne({
      isDM: true,
      members: { $all: members, $size: 2 }
    }).populate('members', 'name avatar');

    if (room) {
      return res.json(room);
    }

    // Create new DM
    room = new Room({
      dmid: `dm_${members.join('_')}`, // Unique ID for DM room
      name: `DM: ${members.join('_')}`,
      isPrivate: true,
      isDM: true,
      creator: currentUserId,
      members,
      admins: [currentUserId]
    });

    await room.save();

    const populatedRoom = await Room.findById(room._id)
      .populate('creator', 'name avatar')
      .populate('members', 'name avatar');

    res.status(201).json(populatedRoom);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to create or fetch DM room' });
  }
});

// Join private room with invite code
router.post('/join/:inviteCode', jwtAuth, async (req, res) => {
  try {
    const { inviteCode } = req.params;
    
    const room = await Room.findOne({ inviteCode })
      .populate('creator', 'name avatar')
      .populate('members', 'name avatar');
    
    if (!room) {
      return res.status(404).json({ message: 'Invalid invite code' });
    }

    if (room.members.some(member => member._id.toString() === req.user._id.toString())) {
      return res.status(400).json({ message: 'Already a member of this room' });
    }

    room.members.push(req.user._id);
    await room.save();

    const updatedRoom = await Room.findById(room._id)
      .populate('creator', 'name avatar')
      .populate('members', 'name avatar');

    res.json(updatedRoom);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});
router.post('/join-public/:roomId', jwtAuth, async (req, res) => {
  try {
    const { roomId } = req.params;

    const room = await Room.findById(roomId)
      .populate('creator', 'name avatar')
      .populate('members', 'name avatar');

    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    if (room.isPrivate) {
      return res.status(403).json({ message: 'Cannot join a private room via public route' });
    }

    const alreadyMember = room.members.some(
      (member) => member._id.toString() === req.user._id.toString()
    );

    if (alreadyMember) {
      return res.status(400).json({ message: 'You are already a member of this room' });
    }

    room.members.push(req.user._id);
    await room.save();

    const updatedRoom = await Room.findById(room._id)
      .populate('creator', 'name avatar')
      .populate('members', 'name avatar');

    res.json(updatedRoom);
  } catch (error) {
    console.error('Join public room error:', error);
    res.status(500).json({ message: 'Failed to join public room' });
  }
});

router.get('/:roomId', jwtAuth, async (req, res) => {
  try {
    const { roomId } = req.params;
    
    const room = await Room.findById(roomId)
      .populate('creator', 'name avatar email')
      .populate('members', 'name avatar email')
      .populate('admins', 'name avatar email');
    
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    // Check if user is a member of the room
    const isMember = room.members.some(member => 
      member._id.toString() === req.user._id.toString()
    );

    if (!isMember && room.isPrivate) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(room);
  } catch (error) {
    console.error('Error fetching room details:', error);
    res.status(500).json({ message: 'Server error' });
  }
});
// DELETE Room (only by creator or admin)
router.delete('/:roomId', jwtAuth, async (req, res) => {
  try {
    const { roomId } = req.params;

    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    // Only creator or admin can delete
    const isAuthorized = room.creator.toString() === req.user._id.toString() ||
      room.admins.map(id => id.toString()).includes(req.user._id.toString());

    if (!isAuthorized) {
      return res.status(403).json({ message: 'You are not allowed to delete this room' });
    }

    await room.deleteOne(); // or room.remove()
    res.json({ message: 'Room deleted successfully' });

  } catch (error) {
    console.error('Delete room error:', error);
    res.status(500).json({ message: 'Failed to delete room' });
  }
});
// Kick member from room (Admin only)
router.delete('/:roomId/members/:memberId', jwtAuth, async (req, res) => {
  try {
    const { roomId, memberId } = req.params;
    const currentUserId = req.user._id.toString();
    
    const room = await Room.findById(roomId)
      .populate('members', 'name avatar')
      .populate('admins', 'name avatar');
    
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    // Check if current user is admin
    const isAdmin = room.admins.some(admin => 
      admin._id.toString() === currentUserId
    );

    if (!isAdmin) {
      return res.status(403).json({ message: 'Only admins can kick members' });
    }

    // Cannot kick yourself
    if (memberId === currentUserId) {
      return res.status(400).json({ message: 'Cannot kick yourself' });
    }

    // Cannot kick the creator
    if (memberId === room.creator.toString()) {
      return res.status(400).json({ message: 'Cannot kick the room creator' });
    }

    // Cannot kick in DM rooms
    if (room.isDM) {
      return res.status(400).json({ message: 'Cannot kick members from DM rooms' });
    }

    // Remove member from room
    room.members = room.members.filter(member => 
      member._id.toString() !== memberId
    );

    // Remove from admins if they were admin
    room.admins = room.admins.filter(admin => 
      admin._id.toString() !== memberId
    );

    await room.save();

    const updatedRoom = await Room.findById(roomId)
      .populate('creator', 'name avatar')
      .populate('members', 'name avatar')
      .populate('admins', 'name avatar');

    res.json({
      message: 'Member kicked successfully',
      room: updatedRoom
    });
  } catch (error) {
    console.error('Error kicking member:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Make member admin (Admin only)
router.post('/:roomId/members/:memberId/promote', jwtAuth, async (req, res) => {
  try {
    const { roomId, memberId } = req.params;
    const currentUserId = req.user._id.toString();
    
    const room = await Room.findById(roomId);
    
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    // Check if current user is admin
    const isAdmin = room.admins.some(admin => 
      admin.toString() === currentUserId
    );

    if (!isAdmin) {
      return res.status(403).json({ message: 'Only admins can promote members' });
    }

    // Check if target user is a member
    const isMember = room.members.some(member => 
      member.toString() === memberId
    );

    if (!isMember) {
      return res.status(400).json({ message: 'User is not a member of this room' });
    }

    // Check if already admin
    const isAlreadyAdmin = room.admins.some(admin => 
      admin.toString() === memberId
    );

    if (isAlreadyAdmin) {
      return res.status(400).json({ message: 'User is already an admin' });
    }

    // Cannot promote in DM rooms
    if (room.isDM) {
      return res.status(400).json({ message: 'Cannot promote members in DM rooms' });
    }

    room.admins.push(memberId);
    await room.save();

    const updatedRoom = await Room.findById(roomId)
      .populate('creator', 'name avatar')
      .populate('members', 'name avatar')
      .populate('admins', 'name avatar');

    res.json({
      message: 'Member promoted to admin successfully',
      room: updatedRoom
    });
  } catch (error) {
    console.error('Error promoting member:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Remove admin privileges (Admin only, cannot demote creator)
router.post('/:roomId/members/:memberId/demote', jwtAuth, async (req, res) => {
  try {
    const { roomId, memberId } = req.params;
    const currentUserId = req.user._id.toString();
    
    const room = await Room.findById(roomId);
    
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    // Check if current user is admin
    const isAdmin = room.admins.some(admin => 
      admin.toString() === currentUserId
    );

    if (!isAdmin) {
      return res.status(403).json({ message: 'Only admins can demote members' });
    }

    // Cannot demote creator
    if (memberId === room.creator.toString()) {
      return res.status(400).json({ message: 'Cannot demote the room creator' });
    }

    // Cannot demote yourself
    if (memberId === currentUserId) {
      return res.status(400).json({ message: 'Cannot demote yourself' });
    }

    // Cannot demote in DM rooms
    if (room.isDM) {
      return res.status(400).json({ message: 'Cannot demote members in DM rooms' });
    }

    room.admins = room.admins.filter(admin => 
      admin.toString() !== memberId
    );

    await room.save();

    const updatedRoom = await Room.findById(roomId)
      .populate('creator', 'name avatar')
      .populate('members', 'name avatar')
      .populate('admins', 'name avatar');

    res.json({
      message: 'Admin privileges removed successfully',
      room: updatedRoom
    });
  } catch (error) {
    console.error('Error demoting member:', error);
    res.status(500).json({ message: 'Server error' });
  }
});
module.exports = router;