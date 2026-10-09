import { useEffect, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { postsApi } from '../api/posts.api.js';
import { getErrorMessage } from '../api/client.js';
import { useAuth } from '../hooks/useAuth.js';
import { canManage } from '../utils/permissions.js';
import { PostForm } from '../components/PostForm.jsx';

export function EditPostPage() {
  const { slug } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    postsApi.getBySlug(slug).then(setPost).catch((err) => setError(getErrorMessage(err)));
  }, [slug]);

  if (error) return <p className="error">{error}</p>;
  if (!post) return <p className="muted">Loading...</p>;
  if (!canManage(user, post.author)) return <Navigate to={`/posts/${post.slug}`} replace />;

  async function handleSubmit(data) {
    const updated = await postsApi.update(post._id, data);
    navigate(`/posts/${updated.slug}`);
  }

  return (
    <div>
      <h1>Edit post</h1>
      <PostForm initial={{ title: post.title, content: post.content }} onSubmit={handleSubmit} submitLabel="Save changes" />
    </div>
  );
}