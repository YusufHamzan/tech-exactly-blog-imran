import { ACTIVITY_ACTIONS } from '../models/ActivityLog.js';
import { z } from 'zod';
import { objectIdSchema, paginationSchema } from './common.schema.js';
import { ALL_ROLES } from '../constants/roles.js';

const idParams = z.object({ params: z.object({ id: objectIdSchema }) });

export const listUsersSchema = z.object({
  query: paginationSchema.extend({
    role: z.enum(ALL_ROLES).optional(),
    search: z.string().trim().max(100).optional(),
  }),
});

export const updateUserRoleSchema = z.object({
  params: z.object({ id: objectIdSchema }),
  body: z.object({ role: z.enum(ALL_ROLES) }),
});

export const userIdSchema = idParams;

export const listAdminPostsSchema = z.object({
  query: paginationSchema.extend({
    status: z.enum(['all', 'active', 'deleted']).default('all'),
    search: z.string().trim().max(100).optional(),
  }),
});

export const postIdSchema = idParams;

export const listAdminCommentsSchema = z.object({
  query: paginationSchema.extend({
    post: objectIdSchema.optional(),
    author: objectIdSchema.optional(),
  }),
});


export const listActivitySchema = z.object({
  query: paginationSchema.extend({
    action: z.enum(ACTIVITY_ACTIONS).optional(),
    user: objectIdSchema.optional(),
  }),
});