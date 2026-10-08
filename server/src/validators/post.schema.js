import { z } from 'zod';
import { objectIdSchema, paginationSchema } from './common.schema.js';

const titleSchema = z.string().trim().min(3, 'Title must be at least 3 characters').max(200);
const contentSchema = z.string().trim().min(10, 'Content must be at least 10 characters');

export const createPostSchema = z.object({
  body: z.object({
    title: titleSchema,
    content: contentSchema,
  }),
});

export const updatePostSchema = z.object({
  params: z.object({ id: objectIdSchema }),
  body: z
    .object({
      title: titleSchema.optional(),
      content: contentSchema.optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: 'Provide at least one field to update',
    }),
});

export const postIdSchema = z.object({
  params: z.object({ id: objectIdSchema }),
});

export const listPostsSchema = z.object({
  query: paginationSchema.extend({
    author: objectIdSchema.optional(),
    search: z.string().trim().max(100).optional(),
  }),
});