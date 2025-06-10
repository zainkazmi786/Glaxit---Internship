
// ===== models/userModel.js =====
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  roles: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Role'
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Populate roles when querying users
userSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'roles',
    populate: {
      path: 'permissionIds',
      select: 'name description'
    }
  });
  next();
});

// Get all user permissions
userSchema.methods.getPermissions = function() {
  const permissions = new Set();
  this.roles.forEach(role => {
    role.permissionIds.forEach(permission => {
      permissions.add(permission.name);
    });
  });
  return Array.from(permissions);
};

module.exports = mongoose.model('User', userSchema);
