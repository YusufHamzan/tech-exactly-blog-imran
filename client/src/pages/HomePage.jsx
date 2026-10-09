import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { postsApi } from '../api/posts.api.js';
import { getErrorMessage } from '../api/client.js';
import { PostCard } from '../components/PostCard.jsx';
import { Pagination } from '../components/Pagination.jsx';

export function HomePage() {
  const [params, setParams] = useSearchParams();
  const page = Number(params.get('page')) || 1;
  const search = params.get('search') || '';

  const [posts, setPosts] = useState([]);
  const [meta, setMeta] = useState(null);
  const [query, setQuery] = useState(search);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    postsApi
      .list({ page, limit: 10, search })
      .then((data) => {
        if (cancelled) return;
        setPosts(data.posts);
        setMeta(data.meta);
        setError('');
      })
      .catch((err) => !cancelled && setError(getErrorMessage(err)))
      .finally(() => !cancelled && setLoading(false));
    return () => { cancelled = true; };
  }, [page, search]);

  function handleSearch(e) {
    e.preventDefault();
    setParams(query ? { search: query } : {}); // resets page to 1
  }

  function changePage(p) {
    setParams({ ...(search && { search }), page: String(p) });
    window.scrollTo(0, 0);
  }

  return (
    <div>
      <div className="row">
        <h1>Latest posts</h1>
        <form onSubmit={handleSearch} className="search">
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search titles..." />
          <button type="submit">Search</button>
        </form>
      </div>

      {search && (
        <p className="muted">
          Results for "{search}" · <button className="link" onClick={() => { setQuery(''); setParams({}); }}>clear</button>
        </p>
      )}

      {error && <p className="error">{error}</p>}
      {loading ? (
        <p className="muted">Loading...</p>
      ) : posts.length === 0 ? (
        <p className="muted">No posts found.</p>
      ) : (
        posts.map((post) => <PostCard key={post._id} post={post} />)
      )}

      <Pagination meta={meta} onChange={changePage} />
    </div>
  );
}