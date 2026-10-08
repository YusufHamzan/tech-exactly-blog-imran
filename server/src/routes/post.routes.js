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

const router = Router();

// Public
router.get('/', validate(listPostsSchema), postController.listPosts);
router.get('/:slug', postController.getPost);

// Authenticated (ownership enforced in the service)
router.post('/', authenticate, validate(createPostSchema), postController.createPost);
router.patch('/:id', authenticate, validate(updatePostSchema), postController.updatePost);
router.delete('/:id', authenticate, validate(postIdSchema), postController.deletePost);

export default router;