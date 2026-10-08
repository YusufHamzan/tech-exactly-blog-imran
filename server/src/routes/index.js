import { Router } from 'express';
import { User, Post, Comment } from '../models/index.js';

const router = Router();

router.get('/health', async (req, res) => {
  const [users, posts, comments] = await Promise.all([
    User.countDocuments(),
    Post.countDocuments(),
    Comment.countDocuments(),
  ]);
  res.json({ success: true, data: { status: 'ok', users, posts, comments } });
});

export default router;