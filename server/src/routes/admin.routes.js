import { Router } from 'express';
import * as adminController from '../controllers/admin.controller.js';
import { authenticate } from '../middleware/authenticate.js';
import { authorize } from '../middleware/authorize.js';
import { validate } from '../middleware/validate.js';
import { ROLES } from '../constants/roles.js';
import {
  listUsersSchema,
  updateUserRoleSchema,
  userIdSchema,
  listAdminPostsSchema,
  postIdSchema,
  listAdminCommentsSchema,
  listActivitySchema,
} from '../validators/admin.schema.js';
import { logActivity } from '../middleware/logActivity.js';

const router = Router();

// Every route below requires an authenticated admin
router.use(authenticate, authorize(ROLES.ADMIN));

// Dashboard
router.get('/stats', adminController.getStats);

// Users
router.get('/users', validate(listUsersSchema), adminController.listUsers);
router.patch('/users/:id/role', validate(updateUserRoleSchema), logActivity('USER_ROLE_UPDATE', 'User'), adminController.updateUserRole);
router.delete('/users/:id', validate(userIdSchema), logActivity('USER_DELETE', 'User'), adminController.deleteUser);

// Posts (including soft-deleted)
router.get('/posts', validate(listAdminPostsSchema), adminController.listAllPosts);
router.patch('/posts/:id/restore', validate(postIdSchema), logActivity('POST_RESTORE', 'Post'), adminController.restorePost);
router.delete('/posts/:id', validate(postIdSchema), logActivity('POST_PERMANENT_DELETE', 'Post'), adminController.permanentlyDeletePost);

// Comments
router.get('/comments', validate(listAdminCommentsSchema), adminController.listAllComments);

// Activity Logs
router.get('/activity', validate(listActivitySchema), adminController.listActivity);
// router.get('/activity', validate(listActivitySchema),(req, res) => {
//   res.json({ success: true, data: { status: 'ok', time: new Date().toISOString() } });
// });


export default router;