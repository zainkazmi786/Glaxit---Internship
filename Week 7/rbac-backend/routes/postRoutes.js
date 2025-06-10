
// ===== routes/postRoutes.js =====
const express = require('express');
const {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost
} = require('../controllers/postController');
const authMiddleware = require('../middlewares/authMiddleware');
const { checkPermission } = require('../middlewares/permissionMiddleware');

const router = express.Router();

// Public routes
router.get('/', getAllPosts);
router.get('/:id', getPostById);

// Protected routes
router.use(authMiddleware);

router.post('/', checkPermission('create_post'), createPost);
router.put('/:id', checkPermission('edit_post'), updatePost);
router.delete('/:id', checkPermission('delete_post'), deletePost);

module.exports = router;