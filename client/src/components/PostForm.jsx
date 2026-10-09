import { useState } from 'react';
import { getErrorMessage } from '../api/client.js';

export function PostForm({ initial = { title: '', content: '' }, onSubmit, submitLabel = 'Save' }) {
  const [form, setForm] = useState(initial);
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
      await onSubmit(form);
    } catch (err) {
      setError(getErrorMessage(err, 'Could not save post'));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card">
      {error && <p className="error">{error}</p>}
      <label>
        Title
        <input name="title" value={form.title} onChange={handleChange} required minLength={3} maxLength={200} />
      </label>
      <label>
        Content
        <textarea name="content" value={form.content} onChange={handleChange} required minLength={10} rows={12} />
      </label>
      <button type="submit" disabled={submitting}>{submitting ? 'Saving...' : submitLabel}</button>
    </form>
  );
}