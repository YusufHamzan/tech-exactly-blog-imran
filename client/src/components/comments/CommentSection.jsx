import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { commentsApi } from '../../api/comment.api.js';
import { getErrorMessage } from '../../api/client.js';
import { useAuth } from '../../hooks/useAuth.js';
import { CommentItem } from './CommentItem.jsx';
import { Pagination } from '../Pagination.jsx';
import { Avatar } from '../Avatar.jsx';

export function CommentSection({ postId }) {
    const { user, isAuthenticated } = useAuth();
    const [comments, setComments] = useState([]);
    const [meta, setMeta] = useState(null);
    const [page, setPage] = useState(1);
    const [draft, setDraft] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    const load = useCallback(async () => {
        setLoading(true);
        try {
            const data = await commentsApi.list(postId, { page, limit: 10 });
            setComments(data.comments);
            setMeta(data.meta);
        } catch (err) {
            setError(getErrorMessage(err));
        } finally {
            setLoading(false);
        }
    }, [postId, page]);

    useEffect(() => { load(); }, [load]);

    async function handleCreate(e) {
        e.preventDefault();
        setError('');
        try {
            await commentsApi.create(postId, draft);
            setDraft('');
            // Jump to the last page so the new comment is visible (oldest-first ordering)
            const lastPage = Math.ceil((meta.total + 1) / meta.limit);
            if (lastPage !== page) setPage(lastPage); else load();
        } catch (err) {
            setError(getErrorMessage(err));
        }
    }

    async function handleUpdate(id, content) {
        try {
            const updated = await commentsApi.update(postId, id, content);
            setComments((list) => list.map((c) => (c._id === id ? { ...c, ...updated } : c)));
        } catch (err) {
            setError(getErrorMessage(err));
            throw err;
        }
    }

    async function handleDelete(id) {
        try {
            await commentsApi.remove(postId, id);
            load();
        } catch (err) {
            setError(getErrorMessage(err));
        }
    }

    return (
        <section className="card comments-panel">
            <h2 className="comments-title">
                Comments <span className="muted">({meta?.total ?? 0})</span>
            </h2>
            {error && <p className="error panel-error">{error}</p>}

            {isAuthenticated ? (
                <form onSubmit={handleCreate} className="composer">
                    <Avatar user={user} size={36} />
                    <div className="composer-body">
                        <textarea
                            value={draft}
                            onChange={(e) => setDraft(e.target.value)}
                            placeholder="Add a comment..."
                            rows={2}
                            maxLength={2000}
                            required
                        />
                        <div className="composer-actions">
                            <button type="submit" disabled={!draft.trim()}>Comment</button>
                        </div>
                    </div>
                </form>
            ) : (
                <p className="muted composer-login"><Link to="/login">Log in</Link> to join the conversation.</p>
            )}

            <div className="comment-list">
                {loading ? (
                    <p className="muted empty">Loading comments...</p>
                ) : comments.length === 0 ? (
                    <p className="muted empty">No comments yet. Be the first.</p>
                ) : (
                    comments.map((c) => (
                        <CommentItem key={c._id} comment={c} onUpdate={handleUpdate} onDelete={handleDelete} />
                    ))
                )}
            </div>

            <Pagination meta={meta} onChange={setPage} />
        </section>
    );
}