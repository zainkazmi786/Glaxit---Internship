
// ===== models/roleModel.js =====
const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  permissionIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Permission'
  }]
}, {
  timestamps: true
});
// Populate permissions when querying roles
roleSchema.pre(/^find/, function(next) {
  this.populate('permissionIds', 'name description');
  next();
});

module.exports = mongoose.model('Role', roleSchema);
