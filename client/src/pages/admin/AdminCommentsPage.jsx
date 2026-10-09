import { Link, useSearchParams } from 'react-router-dom';
import { adminApi } from '../../api/admin.api.js';
import { commentsApi } from '../../api/comment.api.js';
import { getErrorMessage } from '../../api/client.js';
import { usePagedList } from '../../hooks/usePagedList.js';
import { Pagination } from '../../components/Pagination.jsx';
import { ConfirmButton } from '../../components/ConfirmButton.jsx';
import { Badge } from '../../components/Badge.jsx';
import { formatDateTime, excerpt } from '../../utils/format.js';

export function AdminCommentsPage() {
  const [params, setParams] = useSearchParams();
  const page = Number(params.get('page')) || 1;

  const { items, meta, loading, error, setError, reload } = usePagedList(adminApi.comments, { page, limit: 20 });

  async function remove(c) {
    try {
      await commentsApi.remove(c.post._id, c._id);
      reload();
    } catch (err) { setError(getErrorMessage(err)); }
  }

  return (
    <div>
      <div className="page-header">
        <h1>Comments {meta && <span className="muted small">({meta.total})</span>}</h1>
      </div>
      {error && <p className="error">{error}</p>}

      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr><th>Comment</th><th>Author</th><th>Post</th><th>Posted</th><th></th></tr>
          </thead>
          <tbody>
            {loading ? (
              <tr className="empty-row"><td colSpan={5}>Loading...</td></tr>
            ) : items.length === 0 ? (
              <tr className="empty-row"><td colSpan={5}>No comments.</td></tr>
            ) : items.map((c) => (
              <tr key={c._id}>
                <td className="wrap">{excerpt(c.content, 120)}</td>
                <td>{c.author?.name ?? <em className="muted">deleted user</em>}</td>
                <td className="wrap">
                  {c.post ? (
                    c.post.isDeleted
                      ? <>{c.post.title} <Badge tone="red">deleted</Badge></>
                      : <Link to={`/posts/${c.post.slug}`}>{c.post.title}</Link>
                  ) : <em className="muted">missing post</em>}
                </td>
                <td className="muted">{formatDateTime(c.createdAt)}</td>
                <td>
                  <div className="actions">
                    <ConfirmButton disabled={!c.post} message="Delete this comment?" onConfirm={() => remove(c)}>Delete</ConfirmButton>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination meta={meta} onChange={(p) => setParams({ page: String(p) })} />
    </div>
  );
}