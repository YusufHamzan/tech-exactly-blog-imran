import mongoose from 'mongoose';

const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 200 },
    slug: { type: String, required: true, unique: true, lowercase: true },
    content: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

postSchema.index({ author: 1, createdAt: -1 });
postSchema.index({ isDeleted: 1, createdAt: -1 });

// Hide soft-deleted posts from every find/count query by default.
// Pass { withDeleted: true } as a query option to include them (admin use).
postSchema.pre(/^find/, function () {
  if (!this.getOptions().withDeleted) {
    this.where({ isDeleted: false });
  }
});
postSchema.pre('countDocuments', function () {
  if (!this.getOptions().withDeleted) {
    this.where({ isDeleted: false });
  }
});

postSchema.methods.softDelete = function () {
  this.isDeleted = true;
  this.deletedAt = new Date();
  return this.save();
};

export const Post = mongoose.model('Post', postSchema);