import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';

export function OAuthCallbackPage() {
  const { refreshSession } = useAuth();
  const navigate = useNavigate();
  const ran = useRef(false);

  useEffect(() => {
    // React StrictMode runs effects twice in dev. A second refresh would race the
    // first one and fail on the rotated token, so guard with a ref.
    if (ran.current) return;
    ran.current = true;

    refreshSession()
      .then(() => navigate('/dashboard', { replace: true }))
      .catch(() => navigate('/login?error=google', { replace: true }));
  }, [refreshSession, navigate]);

  return <p className="muted">Completing sign-in...</p>;
}