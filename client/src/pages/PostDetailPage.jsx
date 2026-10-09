import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { postsApi } from '../api/posts.api.js';
import { getErrorMessage } from '../api/client.js';
import { useAuth } from '../hooks/useAuth.js';
import { canManage } from '../utils/permissions.js';
import { formatDateTime } from '../utils/format.js';
import { ConfirmButton } from '../components/ConfirmButton.jsx';
import { CommentSection } from '../components/comments/CommentSection.jsx';
import { Avatar } from '../components/Avatar.jsx';
import { PencilIcon, TrashIcon } from '../components/Icons.jsx';

export function PostDetailPage() {
    const { slug } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [error, setError] = useState('');
    const [status, setStatus] = useState('loading');

    useEffect(() => {
        setStatus('loading');
        postsApi
            .getBySlug(slug)
            .then((p) => { setPost(p); setStatus('ready'); })
            .catch((err) => {
                setStatus(err.response?.status === 404 ? 'notfound' : 'error');
                setError(getErrorMessage(err));
            });
    }, [slug]);

    async function handleDelete() {
        try {
            await postsApi.remove(post._id);
            navigate('/dashboard');
        } catch (err) {
            setError(getErrorMessage(err));
        }
    }

    if (status === 'loading') return <p className="muted">Loading...</p>;
    if (status === 'notfound') return <div><h1>Post not found</h1><Link to="/">Back to posts</Link></div>;
    if (status === 'error') return <p className="error">{error}</p>;

    return (
        <div>
            <article className="card post-detail">
                {canManage(user, post.author) && (
                    <div className="card-actions-top">
                        <Link to={`/posts/${post.slug}/edit`} className="icon-btn" title="Edit post" aria-label="Edit post">
                            <PencilIcon />
                        </Link>
                        <ConfirmButton
                            className="icon-btn danger-text"
                            message="Delete this post?"
                            onConfirm={handleDelete}
                            title="Delete post"
                            aria-label="Delete post"
                        >
                            <TrashIcon />
                        </ConfirmButton>
                    </div>
                )}

                <h1>{post.title}</h1>
                <div className="author-row">
                    <Avatar user={post.author} size={40} />
                    <div>
                        <strong>{post.author?.name ?? 'Unknown'}</strong>
                        <p className="post-meta muted">
                            {formatDateTime(post.createdAt)}
                            {post.updatedAt !== post.createdAt && ` · updated ${formatDateTime(post.updatedAt)}`}
                        </p>
                    </div>
                </div>

                <div className="content">{post.content}</div>
                {error && <p className="error">{error}</p>}
            </article>

            <CommentSection
                postId={post._id}
                onCountChange={(total) => setPost((p) => (p ? { ...p, commentCount: total } : p))}
            />
        </div>
    );
}