import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { adminApi } from '../../api/admin.api.js';
import { getErrorMessage } from '../../api/client.js';
import { usePagedList } from '../../hooks/usePagedList.js';
import { Badge } from '../../components/Badge.jsx';
import { Pagination } from '../../components/Pagination.jsx';
import { ConfirmButton } from '../../components/ConfirmButton.jsx';
import { formatDate } from '../../utils/format.js';

export function AdminPostsPage() {
  const [params, setParams] = useSearchParams();
  const page = Number(params.get('page')) || 1;
  const status = params.get('status') || 'all';
  const search = params.get('search') || '';
  const [query, setQuery] = useState(search);

  const { items, meta, loading, error, setError, reload } = usePagedList(adminApi.posts, { page, limit: 15, status, search });

  const update = (patch) => setParams({ ...Object.fromEntries(params), page: '1', ...patch });

  async function run(action) {
    try { await action(); reload(); } catch (err) { setError(getErrorMessage(err)); }
  }

  return (
    <div>
      <div className="page-header">
        <h1>Posts {meta && <span className="muted small">({meta.total})</span>}</h1>
        <form className="filters" onSubmit={(e) => { e.preventDefault(); update({ search: query }); }}>
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search titles" />
          <select value={status} onChange={(e) => update({ status: e.target.value })}>
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="deleted">Deleted</option>
          </select>
          <button type="submit">Search</button>
        </form>
      </div>
      {error && <p className="error">{error}</p>}

      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr><th>Title</th><th>Author</th><th>Status</th><th>Created</th><th>Deleted</th><th></th></tr>
          </thead>
          <tbody>
            {loading ? (
              <tr className="empty-row"><td colSpan={6}>Loading...</td></tr>
            ) : items.length === 0 ? (
              <tr className="empty-row"><td colSpan={6}>No posts found.</td></tr>
            ) : items.map((p) => (
              <tr key={p._id}>
                <td className="wrap">
                  {p.isDeleted ? p.title : <Link to={`/posts/${p.slug}`}>{p.title}</Link>}
                  <div className="muted small">/{p.slug}</div>
                </td>
                <td>{p.author?.name ?? <em className="muted">deleted user</em>}</td>
                <td><Badge tone={p.isDeleted ? 'red' : 'green'}>{p.isDeleted ? 'deleted' : 'active'}</Badge></td>
                <td className="muted">{formatDate(p.createdAt)}</td>
                <td className="muted">{p.deletedAt ? formatDate(p.deletedAt) : '–'}</td>
                <td>
                  <div className="actions">
                    {p.isDeleted ? (
                      <button className="secondary" onClick={() => run(() => adminApi.restorePost(p._id))}>Restore</button>
                    ) : (
                      <Link className="button secondary" to={`/posts/${p.slug}/edit`}>Edit</Link>
                    )}
                    <ConfirmButton
                      message={`Permanently delete "${p.title}" and all its comments? This cannot be undone.`}
                      onConfirm={() => run(() => adminApi.destroyPost(p._id))}
                    >
                      Delete forever
                    </ConfirmButton>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination meta={meta} onChange={(p) => setParams({ ...Object.fromEntries(params), page: String(p) })} />
    </div>
  );
}