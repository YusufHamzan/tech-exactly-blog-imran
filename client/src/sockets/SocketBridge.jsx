import { useEffect } from 'react';
import { socket, connectSocket, disconnectSocket } from './socket.js';
import { useAuth } from '../hooks/useAuth.js';
import { useToast } from '../context/ToastContext.jsx';

export function SocketBridge() {
  const { user, loading } = useAuth();
  const { push } = useToast();

  useEffect(() => {
    if (loading) return;
    connectSocket();
    return () => disconnectSocket();
  }, [loading, user?._id]);

  useEffect(() => {
    function onCommentNotify(payload) {
      if (String(payload.comment?.author?._id) === String(user?._id)) return;
      push({
        title: 'New comment',
        body: payload.message,
        href: `/posts/${payload.postSlug}`,
      });
    }

    function onPostCreated({ post }) {
      if (String(post.author?._id) === String(user?._id)) return;
      push({
        title: 'New post',
        body: `${post.author?.name ?? 'Someone'} published "${post.title}"`,
        href: `/posts/${post.slug}`,
      });
    }

    socket.on('notify:comment', onCommentNotify);
    socket.on('post:created', onPostCreated);
    return () => {
      socket.off('notify:comment', onCommentNotify);
      socket.off('post:created', onPostCreated);
    };
  }, [user?._id, push]);

  return null;
}