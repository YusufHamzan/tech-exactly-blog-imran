import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { adminApi } from '../../api/admin.api.js';
import { getErrorMessage } from '../../api/client.js';
import { useAuth } from '../../hooks/useAuth.js';
import { usePagedList } from '../../hooks/usePagedList.js';
import { Avatar } from '../../components/Avatar.jsx';
import { Badge } from '../../components/Badge.jsx';
import { Pagination } from '../../components/Pagination.jsx';
import { ConfirmButton } from '../../components/ConfirmButton.jsx';
import { formatDate } from '../../utils/format.js';

export function AdminUsersPage() {
  const { user: me } = useAuth();
  const [params, setParams] = useSearchParams();
  const page = Number(params.get('page')) || 1;
  const role = params.get('role') || '';
  const search = params.get('search') || '';
  const [query, setQuery] = useState(search);

  const { items, meta, loading, error, setError, reload } = usePagedList(adminApi.users, { page, limit: 15, role, search });

  const update = (patch) => setParams({ ...Object.fromEntries(params), page: '1', ...patch });

  async function toggleRole(u) {
    try {
      await adminApi.updateUserRole(u._id, u.role === 'admin' ? 'user' : 'admin');
      reload();
    } catch (err) { setError(getErrorMessage(err)); }
  }

  async function remove(u) {
    try {
      await adminApi.deleteUser(u._id);
      reload();
    } catch (err) { setError(getErrorMessage(err)); }
  }

  return (
    <div>
      <div className="page-header">
        <h1>Users {meta && <span className="muted small">({meta.total})</span>}</h1>
        <form className="filters" onSubmit={(e) => { e.preventDefault(); update({ search: query }); }}>
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search name or email" />
          <select value={role} onChange={(e) => update({ role: e.target.value })}>
            <option value="">All roles</option>
            <option value="admin">Admins</option>
            <option value="user">Users</option>
          </select>
          <button type="submit">Search</button>
        </form>
      </div>
      {error && <p className="error">{error}</p>}

      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr><th>User</th><th>Email</th><th>Role</th><th>Provider</th><th>Joined</th><th></th></tr>
          </thead>
          <tbody>
            {loading ? (
              <tr className="empty-row"><td colSpan={6}>Loading...</td></tr>
            ) : items.length === 0 ? (
              <tr className="empty-row"><td colSpan={6}>No users found.</td></tr>
            ) : items.map((u) => {
              const isMe = u._id === me._id;
              return (
                <tr key={u._id}>
                  <td><div className="cell-user"><Avatar user={u} size={28} />{u.name}{isMe && <span className="muted small"> (you)</span>}</div></td>
                  <td>{u.email}</td>
                  <td><Badge tone={u.role === 'admin' ? 'indigo' : 'gray'}>{u.role}</Badge></td>
                  <td className="muted">{u.provider}</td>
                  <td className="muted">{formatDate(u.createdAt)}</td>
                  <td>
                    <div className="actions">
                      <button className="secondary" disabled={isMe} title={isMe ? 'You cannot change your own role' : ''} onClick={() => toggleRole(u)}>
                        {u.role === 'admin' ? 'Make user' : 'Make admin'}
                      </button>
                      <ConfirmButton
                        disabled={isMe}
                        message={`Delete ${u.name}? Their posts will be soft-deleted and their comments removed.`}
                        onConfirm={() => remove(u)}
                      >
                        Delete
                      </ConfirmButton>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <Pagination meta={meta} onChange={(p) => setParams({ ...Object.fromEntries(params), page: String(p) })} />
    </div>
  );
}