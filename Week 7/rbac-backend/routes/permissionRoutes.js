
// ===== routes/permissionRoutes.js =====
const express = require('express');
const {
  getAllPermissions,
  getPermissionById,
  createPermission,
  updatePermission,
  deletePermission
} = require('../controllers/permissionController');
const authMiddleware = require('../middlewares/authMiddleware');
const { checkPermission } = require('../middlewares/permissionMiddleware');

const router = express.Router();

// All permission routes require authentication
router.use(authMiddleware);

// Get all permissions (accessible to authenticated users)
router.get('/', getAllPermissions);

// Get permission by ID (accessible to authenticated users)
router.get('/:id', getPermissionById);

// Admin-only routes
router.post('/', checkPermission('manage_permissions'), createPermission);
router.put('/:id', checkPermission('manage_permissions'), updatePermission);
router.delete('/:id', checkPermission('manage_permissions'), deletePermission);

module.exports = router;
