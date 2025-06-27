
// utils/helpers.js
const User = require('../models/User');
const crypto = require('crypto');

/**
 * Generate a random invite code for private rooms
 * @returns {string} 8-character invite code
 */
const generateInviteCode = () => {
  return crypto.randomBytes(4).toString('hex').toUpperCase();
};

/**
 * Generate DM room ID from two user IDs
 * @param {string} userId1 
 * @param {string} userId2 
 * @returns {string} DM room ID
 */
const generateDMRoomId = (userId1, userId2) => {
  const sortedIds = [userId1, userId2].sort();
  return `dm_${sortedIds[0]}_${sortedIds[1]}`;
};

const getAvatarByUserId = async (userId) => {
  try {
    const user = await User.findById(userId).select('avatar');
    return user?.avatar || '/default-avatar.png';
  } catch (error) {
    console.error(`Error fetching avatar for user ${userId}:`, error);
    return '/default-avatar.png';
  }
};


module.exports = {
  generateInviteCode,
  generateDMRoomId,
  getAvatarByUserId
};


