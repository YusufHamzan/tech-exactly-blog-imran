import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';

export function Navbar() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate('/');
  }

  return (
    <header className="navbar">
      <Link to="/" className="brand">MERN Blog</Link>
      <nav>
        <NavLink to="/">Posts</NavLink>
        {isAuthenticated && <NavLink to="/dashboard">My Posts</NavLink>}
        {isAdmin && <NavLink to="/admin">Admin</NavLink>}
      </nav>
      <div className="nav-right">
        {isAuthenticated ? (
          <>
            <span className="muted">{user.name}</span>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <NavLink to="/login">Login</NavLink>
            <NavLink to="/register">Register</NavLink>
          </>
        )}
      </div>
    </header>
  );
}