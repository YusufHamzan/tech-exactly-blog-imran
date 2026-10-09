import { Link } from 'react-router-dom';

export function StatCard({ label, value, to }) {
  const body = (
    <>
      <div className="label">{label}</div>
      <div className="value">{value ?? '–'}</div>
    </>
  );
  return to ? <Link to={to} className="card stat-card">{body}</Link> : <div className="card stat-card">{body}</div>;
}