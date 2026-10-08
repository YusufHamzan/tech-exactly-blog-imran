import { useState } from 'react';
import { useAuth } from '../hooks/useAuth.js';
import { authApi } from '../api/auth.api.js';
import { getErrorMessage } from '../api/client.js';

export function DashboardPage() {
  const { user } = useAuth();
  const [result, setResult] = useState('');

  async function whoAmI() {
    try {
      const data = await authApi.me();
      setResult(`Server says: ${data.user.name} (${data.user.role})`);
    } catch (err) {
      setResult(getErrorMessage(err));
    }
  }

  return (
    <div>
      <h1>Welcome, {user.name}</h1>
      <p className="muted">Role: {user.role}</p>
      <button onClick={whoAmI}>Who am I? (calls /auth/me)</button>
      {result && <p>{result}</p>}
    </div>
  );
}