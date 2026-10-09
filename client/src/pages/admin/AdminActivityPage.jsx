import { useSearchParams } from 'react-router-dom';
import { adminApi } from '../../api/admin.api.js';
import { usePagedList } from '../../hooks/usePagedList.js';
import { ACTIVITY_ACTIONS } from '../../constants/activity.js';
import { Badge } from '../../components/Badge.jsx';
import { Pagination } from '../../components/Pagination.jsx';
import { formatDateTime } from '../../utils/format.js';

const toneFor = (action) =>
  action.includes('DELETE') ? 'red' : action.includes('CREATE') || action === 'REGISTER' ? 'green' : 'gray';

export function AdminActivityPage() {
  const [params, setParams] = useSearchParams();
  const page = Number(params.get('page')) || 1;
  const action = params.get('action') || '';

  const { items, meta, loading, error } = usePagedList(adminApi.activity, { page, limit: 25, action });

  return (
    <div>
      <div className="page-header">
        <h1>Activity log {meta && <span className="muted small">({meta.total})</span>}</h1>
        <div className="filters">
          <select value={action} onChange={(e) => setParams(e.target.value ? { action: e.target.value } : {})}>
            <option value="">All actions</option>
            {ACTIVITY_ACTIONS.map((a) => <option key={a} value={a}>{a}</option>)}
          </select>
        </div>
      </div>
      {error && <p className="error">{error}</p>}

      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr><th>Time</th><th>User</th><th>Action</th><th>Entity</th><th>Details</th><th>IP</th></tr>
          </thead>
          <tbody>
            {loading ? (
              <tr className="empty-row"><td colSpan={6}>Loading...</td></tr>
            ) : items.length === 0 ? (
              <tr className="empty-row"><td colSpan={6}>No activity.</td></tr>
            ) : items.map((a) => (
              <tr key={a._id}>
                <td className="muted">{formatDateTime(a.createdAt)}</td>
                <td>{a.user ? <>{a.user.name} <span className="muted small">({a.user.role})</span></> : <em className="muted">deleted user</em>}</td>
                <td><Badge tone={toneFor(a.action)}>{a.action}</Badge></td>
                <td className="muted">{a.entityType ?? '–'}</td>
                <td className="wrap">{a.meta ? <code className="meta">{JSON.stringify(a.meta)}</code> : '–'}</td>
                <td className="muted small">{a.ip ?? '–'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination meta={meta} onChange={(p) => setParams({ ...(action && { action }), page: String(p) })} />
    </div>
  );
}