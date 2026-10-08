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
import { logActivity } from '../middleware/logActivity.js';

// mergeParams lets this router see :postId from the parent (post) router
const router = Router({ mergeParams: true });

router.get('/', validate(listCommentsSchema), commentController.listComments);
router.post('/', authenticate, validate(createCommentSchema), logActivity('COMMENT_CREATE', 'Comment'), commentController.createComment);
router.patch('/:id', authenticate, validate(updateCommentSchema), logActivity('COMMENT_UPDATE', 'Comment'), commentController.updateComment);
router.delete('/:id', authenticate, validate(commentIdSchema), logActivity('COMMENT_DELETE', 'Comment'), commentController.deleteComment);

export default router;