import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import { Avatar } from '../Avatar.jsx';

const LOGO_SRC = 'https://tecdn.techexactly.com/wp-content/uploads/2023/09/TE-Logo.webp';

export function Navbar() {
    const { user, isAuthenticated, isAdmin, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const [menuOpen, setMenuOpen] = useState(false);   // mobile nav links
    const [userOpen, setUserOpen] = useState(false);   // avatar dropdown
    const userMenuRef = useRef(null);

    // Close everything on navigation
    useEffect(() => {
        setMenuOpen(false);
        setUserOpen(false);
    }, [location.pathname]);

    // Close the dropdown on outside click or Escape
    useEffect(() => {
        if (!userOpen) return;
        const onClick = (e) => {
            if (!userMenuRef.current?.contains(e.target)) setUserOpen(false);
        };
        const onKey = (e) => e.key === 'Escape' && setUserOpen(false);
        document.addEventListener('mousedown', onClick);
        document.addEventListener('keydown', onKey);
        return () => {
            document.removeEventListener('mousedown', onClick);
            document.removeEventListener('keydown', onKey);
        };
    }, [userOpen]);

    async function handleLogout() {
        setUserOpen(false);
        await logout();
        navigate('/');
    }

    return (
        <header className="navbar">
            <div className="navbar-inner">
                <Link to="/" className="brand">
                    <img src={LOGO_SRC} alt="Tech Exactly" className="brand-logo" />
                    <span className="brand-text">MERN Blog</span>
                </Link>

                <button
                    type="button"
                    className="hamburger"
                    aria-label="Toggle navigation"
                    aria-expanded={menuOpen}
                    onClick={() => setMenuOpen((o) => !o)}
                >
                    <span /><span /><span />
                </button>

                <nav className={`nav-links ${menuOpen ? 'open' : ''}`}>
                    <NavLink to="/" end>Posts</NavLink>
                    {isAuthenticated && <NavLink to="/dashboard">My Posts</NavLink>}
                    {isAdmin && <NavLink to="/admin">Admin</NavLink>}
                    {!isAuthenticated && (
                        <div className="nav-auth-mobile">
                            <NavLink to="/login">Login</NavLink>
                            <NavLink to="/register" className="button">Register</NavLink>
                        </div>
                    )}
                </nav>

                <div className="nav-right">
                    {isAuthenticated ? (
                        <div className="user-menu" ref={userMenuRef}>
                            <button
                                type="button"
                                className="user-trigger"
                                onClick={() => setUserOpen((o) => !o)}
                                aria-haspopup="menu"
                                aria-expanded={userOpen}
                            >
                                <Avatar user={user} size={34} />
                                <span className="user-name">{user.name}</span>
                            </button>

                            {userOpen && (
                                <div className="dropdown" role="menu">
                                    <div className="dropdown-header">
                                        <strong>{user.name}</strong>
                                        <span className="muted small">{user.email}</span>
                                        <span className="badge">{user.role}</span>
                                    </div>
                                    <Link to="/dashboard" role="menuitem">My Posts</Link>
                                    <Link to="/posts/new" role="menuitem">New post</Link>
                                    {isAdmin && <Link to="/admin" role="menuitem">Admin panel</Link>}
                                    <button type="button" className="dropdown-logout" role="menuitem" onClick={handleLogout}>
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="nav-auth-desktop">
                            <NavLink to="/login">Login</NavLink>
                            <NavLink to="/register" className="button">Register</NavLink>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}