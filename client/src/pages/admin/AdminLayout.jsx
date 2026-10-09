import { NavLink, Outlet } from 'react-router-dom';

const links = [
  { to: '/admin', label: 'Dashboard', end: true },
  { to: '/admin/users', label: 'Users' },
  { to: '/admin/posts', label: 'Posts' },
  { to: '/admin/comments', label: 'Comments' },
  { to: '/admin/activity', label: 'Activity' },
];

export function AdminLayout() {
  return (
    <div className="admin">
      <aside className="admin-sidebar">
        {links.map((l) => (
          <NavLink key={l.to} to={l.to} end={l.end}>{l.label}</NavLink>
        ))}
      </aside>
      <section className="admin-main">
        <Outlet />
      </section>
    </div>
  );
}