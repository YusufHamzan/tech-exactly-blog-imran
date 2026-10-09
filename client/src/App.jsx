import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import { Layout } from './components/layout/Layout.jsx';
import { ProtectedRoute } from './routes/ProtectedRoute.jsx';
import { AdminRoute } from './routes/AdminRoute.jsx';
import { HomePage } from './pages/HomePage.jsx';
import { LoginPage } from './pages/LoginPage.jsx';
import { RegisterPage } from './pages/RegisterPage.jsx';
import { OAuthCallbackPage } from './pages/OAuthCallbackPage.jsx';
import { DashboardPage } from './pages/DashboardPage.jsx';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage.jsx';
import { NotFoundPage } from './pages/NotFoundPage.jsx';
import { PostDetailPage } from './pages/PostDetailPage.jsx';
import { NewPostPage } from './pages/NewPostPage.jsx';
import { EditPostPage } from './pages/EditPostPage.jsx';
import { AdminLayout } from './pages/admin/AdminLayout.jsx';
import { AdminUsersPage } from './pages/admin/AdminUsersPage.jsx';
import { AdminPostsPage } from './pages/admin/AdminPostsPage.jsx';
import { AdminCommentsPage } from './pages/admin/AdminCommentsPage.jsx';
import { AdminActivityPage } from './pages/admin/AdminActivityPage.jsx';
import { ToastProvider } from './context/ToastContext.jsx';
import { SocketBridge } from './sockets/SocketBridge.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <SocketBridge />
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/posts/:slug" element={<PostDetailPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/oauth/callback" element={<OAuthCallbackPage />} />

              <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/posts/new" element={<NewPostPage />} />
                <Route path="/posts/:slug/edit" element={<EditPostPage />} />
              </Route>

              <Route element={<AdminRoute />}>
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<AdminDashboardPage />} />
                  <Route path="users" element={<AdminUsersPage />} />
                  <Route path="posts" element={<AdminPostsPage />} />
                  <Route path="comments" element={<AdminCommentsPage />} />
                  <Route path="activity" element={<AdminActivityPage />} />
                </Route>
              </Route>

              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter >
  );
}