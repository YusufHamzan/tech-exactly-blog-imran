import { z } from 'zod';
import { objectIdSchema, paginationSchema } from './common.schema.js';

const contentSchema = z.string().trim().min(1, 'Comment cannot be empty').max(2000);

const postIdParams = z.object({ postId: objectIdSchema });
const commentParams = z.object({ postId: objectIdSchema, id: objectIdSchema });

export const listCommentsSchema = z.object({
  params: postIdParams,
  query: paginationSchema,
});

export const createCommentSchema = z.object({
  params: postIdParams,
  body: z.object({ content: contentSchema }),
});

export const updateCommentSchema = z.object({
  params: commentParams,
  body: z.object({ content: contentSchema }),
});

export const commentIdSchema = z.object({
  params: commentParams,
});