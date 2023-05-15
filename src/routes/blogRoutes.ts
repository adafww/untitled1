import express from 'express';
import { createBlogPost, getBlogPosts, getBlogPost, updateBlogPost, deleteBlogPost } from '../controllers/blogController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/posts', getBlogPosts);
router.get('/posts/:id', getBlogPost);
router.post('/posts', authenticateToken, createBlogPost);
router.put('/posts/:id', authenticateToken, updateBlogPost);
router.delete('/posts/:id', authenticateToken, deleteBlogPost);

export default router;