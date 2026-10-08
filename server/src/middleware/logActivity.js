import { ActivityLog } from '../models/ActivityLog.js';
/**
 * Usage: router.post('/', authenticate, validate(schema), logActivity('POST_CREATE', 'Post'), controller)
 *
 * Registers a listener that fires once the response is sent. Logs only on 2xx,
 * so failed logins, validation errors and 403s are never recorded.
 * Controllers can enrich the entry via res.locals.activity = { user, entityId, meta }.
 */
export const logActivity = (action, entityType) => (req, res, next) => {
  res.on('finish', () => {
    if (res.statusCode >= 400) return;

    const extra = res.locals.activity || {};
    const user = extra.user ?? req.user?._id;
    const entityId = extra.entityId ?? req.params.id ?? req.params.postId;

    ActivityLog.create({
      user,
      action,
      entityType,
      entityId,
      meta: extra.meta,
      ip: req.ip,
    }).catch((err) => {
      // Logging must never break the request that already succeeded
      console.error(`Activity log failed for ${action}:`, err.message);
    });
  });

  next();
};