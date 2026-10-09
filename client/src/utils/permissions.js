export function canManage(user, authorId) {
    if (!user) return false;
    if (user.role === 'admin') return true;
    const id = typeof authorId === 'object' ? authorId?._id : authorId;
    return String(id) === String(user._id);
  }