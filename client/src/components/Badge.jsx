export function Badge({ tone = 'indigo', children }) {
    return <span className={`badge badge-${tone}`}>{children}</span>;
  }