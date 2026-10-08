import commentRoutes from './comment.routes.js';
import { Router } from 'express';
import * as postController from '../controllers/post.controller.js';
import { authenticate } from '../middleware/authenticate.js';
import { validate } from '../middleware/validate.js';
import {
  createPostSchema,
  updatePostSchema,
  postIdSchema,
  listPostsSchema,
} from '../validators/post.schema.js';
import { logActivity } from '../middleware/logActivity.js';

const router = Router();

// Public
router.get('/', validate(listPostsSchema), postController.listPosts);
router.get('/:slug', postController.getPost);

// Authenticated (ownership enforced in the service)
router.post('/', authenticate, validate(createPostSchema), logActivity('POST_CREATE', 'Post'), postController.createPost);
router.patch('/:id', authenticate, validate(updatePostSchema), logActivity('POST_UPDATE', 'Post'), postController.updatePost);
router.delete('/:id', authenticate, validate(postIdSchema), logActivity('POST_DELETE', 'Post'), postController.deletePost);
router.use('/:postId/comments', commentRoutes);

export default router;