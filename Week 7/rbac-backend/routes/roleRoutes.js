
// ===== routes/roleRoutes.js =====
const express = require('express');
const {
  getAllRoles,
  getRoleById,
  createRole,
  updateRole,
  deleteRole,
  assignPermission,
  removePermission
} = require('../controllers/roleController');
const authMiddleware = require('../middlewares/authMiddleware');
const { checkPermission } = require('../middlewares/permissionMiddleware');

const router = express.Router();

// All role routes require authentication
router.use(authMiddleware);

// Get all roles (accessible to authenticated users)
router.get('/', checkPermission('manage_roles'),getAllRoles);

// Get role by ID (accessible to authenticated users)
router.get('/:id',checkPermission('manage_roles'), getRoleById);

// Admin-only routes
router.post('/', checkPermission('manage_roles'), createRole);
router.put('/:id', checkPermission('manage_roles'), updateRole);
router.delete('/:id', checkPermission('manage_roles'), deleteRole);
router.post('/:id/assign-permission', checkPermission('manage_roles'), assignPermission);
router.post('/:id/remove-permission', checkPermission('manage_roles'), removePermission);

module.exports = router;