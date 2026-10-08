import { Router } from 'express';
import * as commentController from '../controllers/comment.controller.js';
import { authenticate } from '../middleware/authenticate.js';
import { validate } from '../middleware/validate.js';
import {
  listCommentsSchema,
  createCommentSchema,
  updateCommentSchema,
  commentIdSchema,
} from '../validators/comment.schema.js';

// mergeParams lets this router see :postId from the parent (post) router
const router = Router({ mergeParams: true });

router.get('/', validate(listCommentsSchema), commentController.listComments);
router.post('/', authenticate, validate(createCommentSchema), commentController.createComment);
router.patch('/:id', authenticate, validate(updateCommentSchema), commentController.updateComment);
router.delete('/:id', authenticate, validate(commentIdSchema), commentController.deleteComment);

export default router;