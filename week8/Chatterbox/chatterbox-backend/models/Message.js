
// models/Message.js
const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({

  roomId: {
    type: String,
    required: true,
    index: true
  },
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  senderName: {
    type: String,
    required: true
  },
  content: {
    type: String,
    // required: true,
    trim: true
  },
  status: {
    type: String,
    enum: ['sent', 'delivered', 'seen'],
    default: 'sent'
  },
  type: {
    type: String,
    enum: ['text', 'image', 'file','video'],
    default: 'text',
    required: false
  },
  url: {
    type: String,
    trim: true,
    default: ''
  },
  filename: {
    type: String,
    trim: true,
    default: ''
  },
  deleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Message', messageSchema);