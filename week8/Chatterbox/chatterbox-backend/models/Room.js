
// models/Room.js
const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  isPrivate: {
    type: Boolean,
    default: false
  },
  isDM: {
    type: Boolean,
    default: false  // 🔥 NEW field to distinguish DMs from rooms
  },
  inviteCode: {
    type: String,
    unique: true,
    sparse: true
  },
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  admins: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Room', roomSchema);