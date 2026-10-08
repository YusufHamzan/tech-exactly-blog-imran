import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import { googleLoginUrl } from '../api/auth.api.js';
import { getErrorMessage } from '../api/client.js';

export function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await register(form);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(getErrorMessage(err, 'Registration failed'));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="card narrow">
      <h1>Create account</h1>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <label>
          Name
          <input name="name" value={form.name} onChange={handleChange} required minLength={2} />
        </label>
        <label>
          Email
          <input type="email" name="email" value={form.email} onChange={handleChange} required />
        </label>
        <label>
          Password
          <input type="password" name="password" value={form.password} onChange={handleChange} required minLength={8} />
        </label>
        <button type="submit" disabled={submitting}>{submitting ? 'Creating...' : 'Register'}</button>
      </form>
      <div className="divider">or</div>
      <a className="button secondary" href={googleLoginUrl}>Continue with Google</a>
      <p className="muted">Already registered? <Link to="/login">Login</Link></p>
    </div>
  );
}