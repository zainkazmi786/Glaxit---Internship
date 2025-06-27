// routes/users.js
const express = require('express');
const jwtAuth = require('../middleware/jwtAuth');
const User = require('../models/User');


const router = express.Router();


// Get all users (for DM functionality)
router.get('/', jwtAuth, async (req, res) => {
  try {
    console.log('Fetching all users for DM functionality');
    const users = await User.find({}, 'name avatar online createdAt')
      .sort({ name: 1 });
    
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Failed to fetch users hello' });
  }
});

// Get user profile
router.get('/profile', jwtAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Failed to fetch user profile' });
  }
});

// Update user profile
router.put('/profile', jwtAuth, async (req, res) => {
  try {
    const { name, avatar } = req.body;
    
    const updateData = {};
    if (name && name.trim()) {
      updateData.name = name.trim();
    }
    if (avatar) {
      updateData.avatar = avatar;
    }
    
    const user = await User.findByIdAndUpdate(
      req.user._id,
      updateData,
      { new: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ message: 'Failed to update user profile' });
  }
});

// Search users
router.get('/search', jwtAuth, async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q || q.trim().length < 2) {
      return res.status(400).json({ message: 'Search query must be at least 2 characters' });
    }
    
    const users = await User.find({
      _id: { $ne: req.user._id }, // Exclude current user
      name: { $regex: q.trim(), $options: 'i' }
    }, 'name avatar online')
      .limit(20)
      .sort({ name: 1 });
    
    res.json(users);
  } catch (error) {
    console.error('Error searching users:', error);
    res.status(500).json({ message: 'Failed to search users' });
  }
});


module.exports = router;