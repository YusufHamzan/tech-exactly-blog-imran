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
} from '../validators/admin.schema.js';

const router = Router();

// Every route below requires an authenticated admin
router.use(authenticate, authorize(ROLES.ADMIN));

// Dashboard
router.get('/stats', adminController.getStats);

// Users
router.get('/users', validate(listUsersSchema), adminController.listUsers);
router.patch('/users/:id/role', validate(updateUserRoleSchema), adminController.updateUserRole);
router.delete('/users/:id', validate(userIdSchema), adminController.deleteUser);

// Posts (including soft-deleted)
router.get('/posts', validate(listAdminPostsSchema), adminController.listAllPosts);
router.patch('/posts/:id/restore', validate(postIdSchema), adminController.restorePost);
router.delete('/posts/:id', validate(postIdSchema), adminController.permanentlyDeletePost);

// Comments
router.get('/comments', validate(listAdminCommentsSchema), adminController.listAllComments);

export default router;