import { Outlet, useLocation } from 'react-router-dom';
import { Navbar } from './Navbar.jsx';

export function Layout() {
    const { pathname } = useLocation();
    const wide = pathname.startsWith('/admin');
    return (
        <>
            <Navbar />
            <main className={`container ${wide ? 'wide' : ''}`}>
                <Outlet />
            </main>
        </>
    );
}