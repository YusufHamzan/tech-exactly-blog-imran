import { Link } from 'react-router-dom';
import { formatDate, excerpt } from '../utils/format.js';
import { Avatar } from './Avatar.jsx';
import { CommentIcon } from './Icons.jsx';

export function PostCard({ post, actions }) {
    return (
        <article className="card post-card">
            <div className="post-card-header">
                <Avatar user={post.author} size={40} />
                <div className="post-card-title">
                    <h2>
                        <Link to={`/posts/${post.slug}`} className="stretched">{post.title}</Link>
                    </h2>
                    <p className="post-meta muted">
                        {post.author?.name ?? 'Unknown'} · {formatDate(post.createdAt)}
                    </p>
                </div>
            </div>
            <p className="excerpt">{excerpt(post.content)}</p>
            <div className="post-card-footer">
                <span className="meta-chip muted small">
                    <CommentIcon width={16} height={16} />
                    {post.commentCount ?? 0} {post.commentCount === 1 ? 'comment' : 'comments'}
                </span>
                {actions && <div className="actions">{actions}</div>}
            </div>
            {/* {actions && <div className="actions">{actions}</div>} */}
        </article>
    );
}