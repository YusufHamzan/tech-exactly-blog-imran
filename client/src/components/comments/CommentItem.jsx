import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth.js';
import { canManage } from '../../utils/permissions.js';
import { formatDateTime } from '../../utils/format.js';
import { ConfirmButton } from '../ConfirmButton.jsx';
import { Avatar } from '../Avatar.jsx';
import { PencilIcon, TrashIcon } from '../Icons.jsx';

export function CommentItem({ comment, onUpdate, onDelete }) {
  const { user } = useAuth();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(comment.content);
  const [saving, setSaving] = useState(false);

  async function save() {
    setSaving(true);
    try {
      await onUpdate(comment._id, draft);
      setEditing(false);
    } finally {
      setSaving(false);
    }
  }

  function cancel() {
    setEditing(false);
    setDraft(comment.content);
  }

  return (
    <div className="comment">
      <Avatar user={comment.author} size={32} />
      <div className="comment-body">
        <div className="comment-header">
          <span>
            <strong>{comment.author?.name ?? 'Unknown'}</strong>
            <span className="muted small">
              {' '}· {formatDateTime(comment.createdAt)}
              {comment.updatedAt !== comment.createdAt && ' · edited'}
            </span>
          </span>

          {!editing && canManage(user, comment.author) && (
            <div className="comment-actions">
              <button type="button" className="icon-btn" onClick={() => setEditing(true)} title="Edit comment" aria-label="Edit comment">
                <PencilIcon width={16} height={16} />
              </button>
              <ConfirmButton
                className="icon-btn danger-text"
                message="Delete this comment?"
                onConfirm={() => onDelete(comment._id)}
                title="Delete comment"
                aria-label="Delete comment"
              >
                <TrashIcon width={16} height={16} />
              </ConfirmButton>
            </div>
          )}
        </div>

        {editing ? (
          <div className="comment-edit">
            <textarea value={draft} onChange={(e) => setDraft(e.target.value)} rows={3} autoFocus />
            <div className="composer-actions">
              <button type="button" className="secondary" onClick={cancel}>Cancel</button>
              <button type="button" onClick={save} disabled={saving || !draft.trim()}>Save</button>
            </div>
          </div>
        ) : (
          <p className="content">{comment.content}</p>
        )}
      </div>
    </div>
  );
}