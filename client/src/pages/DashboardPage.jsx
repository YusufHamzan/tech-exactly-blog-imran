import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { postsApi } from '../api/posts.api.js';
import { getErrorMessage } from '../api/client.js';
import { useAuth } from '../hooks/useAuth.js';
import { PostCard } from '../components/PostCard.jsx';
import { Pagination } from '../components/Pagination.jsx';
import { ConfirmButton } from '../components/ConfirmButton.jsx';

export function DashboardPage() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [meta, setMeta] = useState(null);
  const [page, setPage] = useState(1);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await postsApi.list({ page, limit: 10, author: user._id });
      setPosts(data.posts);
      setMeta(data.meta);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [page, user._id]);

  useEffect(() => { load(); }, [load]);

  async function handleDelete(id) {
    try {
      await postsApi.remove(id);
      load();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }

  return (
    <div>
      <div className="row">
        <h1>My posts</h1>
        <Link className="button" to="/posts/new">New post</Link>
      </div>
      <p className="muted">Signed in as {user.name} ({user.role})</p>
      {error && <p className="error">{error}</p>}

      {loading ? (
        <p className="muted">Loading...</p>
      ) : posts.length === 0 ? (
        <p className="muted">You haven't written anything yet.</p>
      ) : (
        posts.map((post) => (
          <PostCard
            key={post._id}
            post={post}
            actions={
              <>
                <Link className="button secondary" to={`/posts/${post.slug}/edit`}>Edit</Link>
                <ConfirmButton message="Delete this post?" onConfirm={() => handleDelete(post._id)}>Delete</ConfirmButton>
              </>
            }
          />
        ))
      )}

      <Pagination meta={meta} onChange={setPage} />
    </div>
  );
}