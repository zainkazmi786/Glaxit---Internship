
// ===== routes/userRoutes.js =====
const express = require('express');
const {
  getAllUsers,
  getUserById,
  assignRole,
  removeRole,
  updateUserStatus,
  deleteUser
} = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');
const { checkPermission } = require('../middlewares/permissionMiddleware');

const router = express.Router();

// All user routes require authentication
router.use(authMiddleware);

// Get all users (Admin only)
router.get('/', checkPermission('manage_users'), getAllUsers);

// Get user by ID (Admin only)
router.get('/:id', checkPermission('manage_users'), getUserById);

// Assign role to user (Admin only)
router.post('/assign-role', checkPermission('manage_users'), assignRole);

// Remove role from user (Admin only)
router.post('/remove-role', checkPermission('manage_users'), removeRole);

// Update user status (Admin only)
router.patch('/:id/status', checkPermission('manage_users'), updateUserStatus);

// Delete user (Admin only)
router.delete('/:id', checkPermission('manage_users'), deleteUser);

module.exports = router;