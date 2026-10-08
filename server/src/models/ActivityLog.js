import mongoose from 'mongoose';

export const ACTIVITY_ACTIONS = [
  'REGISTER',
  'LOGIN',
  'LOGOUT',
  'POST_CREATE',
  'POST_UPDATE',
  'POST_DELETE',
  'COMMENT_CREATE',
  'COMMENT_DELETE',
  'USER_DELETE',
];

const activityLogSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    action: { type: String, enum: ACTIVITY_ACTIONS, required: true },
    entityType: { type: String },
    entityId: { type: mongoose.Schema.Types.ObjectId },
    meta: { type: mongoose.Schema.Types.Mixed },
    ip: { type: String },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

activityLogSchema.index({ user: 1, createdAt: -1 });
activityLogSchema.index({ action: 1, createdAt: -1 });

export const ActivityLog = mongoose.model('ActivityLog', activityLogSchema);