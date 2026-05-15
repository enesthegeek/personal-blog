import { Router } from 'express';
import { getAllPosts, getPostById, createPost, updatePost, deletePost } from '../controllers/postsController.js';
import { requireAdmin } from '../middleware/auth.js';

const router = Router();

router.get('/',     getAllPosts);
router.get('/:id',  getPostById);
router.post('/',          requireAdmin, createPost);
router.put('/:id',        requireAdmin, updatePost);
router.delete('/:id',     requireAdmin, deletePost);

export default router;
