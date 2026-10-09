import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminApi } from '../../api/admin.api.js';
import { getErrorMessage } from '../../api/client.js';
import { StatCard } from '../../components/admin/StatCard.jsx';
import { Badge } from '../../components/Badge.jsx';
import { formatDateTime } from '../../utils/format.js';

export function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [recent, setRecent] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([adminApi.stats(), adminApi.activity({ page: 1, limit: 8 })])
      .then(([s, a]) => { setStats(s); setRecent(a.items); })
      .catch((err) => setError(getErrorMessage(err)));
  }, []);

  return (
    <div>
      <div className="page-header"><h1>Dashboard</h1></div>
      {error && <p className="error">{error}</p>}

      <div className="stats-grid">
        <StatCard label="Total users" value={stats?.totalUsers} to="/admin/users" />
        <StatCard label="Admins" value={stats?.adminUsers} to="/admin/users?role=admin" />
        <StatCard label="Active posts" value={stats?.totalPosts} to="/admin/posts?status=active" />
        <StatCard label="Deleted posts" value={stats?.deletedPosts} to="/admin/posts?status=deleted" />
        <StatCard label="Comments" value={stats?.totalComments} to="/admin/comments" />
      </div>

      <div className="card">
        <div className="page-header">
          <h2 style={{ margin: 0 }}>Recent activity</h2>
          <Link to="/admin/activity">View all</Link>
        </div>
        {recent.length === 0 ? (
          <p className="muted">No activity yet.</p>
        ) : (
          <div className="activity-list">
            {recent.map((a) => (
              <div key={a._id} className="activity-item">
                <Badge tone="gray">{a.action}</Badge>
                <span>{a.user?.name ?? <em className="muted">deleted user</em>}</span>
                <span className="muted small" style={{ marginLeft: 'auto' }}>{formatDateTime(a.createdAt)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}