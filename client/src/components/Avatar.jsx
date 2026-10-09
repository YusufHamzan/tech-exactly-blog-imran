import { useState } from 'react';

const COLORS = ['#2563eb', '#7c3aed', '#db2777', '#ea580c', '#16a34a', '#0891b2', '#ca8a04'];

function colorFor(name = '') {
  let hash = 0;
  for (const ch of name) hash = (hash * 31 + ch.charCodeAt(0)) >>> 0;
  return COLORS[hash % COLORS.length];
}

function initials(name = '') {
  return name.trim().split(/\s+/).slice(0, 2).map((w) => w[0]?.toUpperCase()).join('') || '?';
}

export function Avatar({ user, size = 36 }) {
  const [broken, setBroken] = useState(false);
  const name = user?.name ?? 'Unknown';
  const style = { width: size, height: size, fontSize: size * 0.4 };

  if (user?.avatar && !broken) {
    return (
      <img
        className="avatar"
        src={user.avatar}
        alt={name}
        style={style}
        referrerPolicy="no-referrer"
        onError={() => setBroken(true)}
      />
    );
  }

  return (
    <span className="avatar avatar-fallback" style={{ ...style, background: colorFor(name) }} title={name} aria-label={name}>
      {initials(name)}
    </span>
  );
}