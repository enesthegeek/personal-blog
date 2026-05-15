import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { API } from '../lib/api';
import TagBadge from '../components/TagBadge';
import { deletePost } from '../lib/api';
import { useAuth } from '../context/AuthContext';

const CATEGORY_META = {
  nuclear:     { label: '⚛ Nuclear',      back: '/nuclear',     color: 'var(--nuclear)', labelClass: 'label--nuclear' },
  programming: { label: '</> Programming', back: '/programming', color: 'var(--accent)',  labelClass: 'label--accent'  },
};

function DeleteConfirm({ onConfirm, onCancel, deleting }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'var(--bg-card)', border: '1px solid #ef444440', borderRadius: 'var(--radius)', padding: '10px 16px' }}>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-dim)', marginRight: 4 }}>
        Delete this post?
      </span>
      <button onClick={onCancel}
        style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)', background: 'none', border: '1px solid var(--border)', borderRadius: 6, padding: '5px 12px', cursor: 'pointer', transition: 'border-color 0.15s, color 0.15s' }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-hover)'; e.currentTarget.style.color = 'var(--text)'; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-muted)'; }}>
        Cancel
      </button>
      <button onClick={onConfirm} disabled={deleting}
        style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#ef4444', background: '#ef444414', border: '1px solid #ef444440', borderRadius: 6, padding: '5px 12px', cursor: deleting ? 'wait' : 'pointer', opacity: deleting ? 0.6 : 1, transition: 'background 0.15s, border-color 0.15s' }}
        onMouseEnter={e => { e.currentTarget.style.background = '#ef444428'; e.currentTarget.style.borderColor = '#ef444480'; }}
        onMouseLeave={e => { e.currentTarget.style.background = '#ef444414'; e.currentTarget.style.borderColor = '#ef444440'; }}>
        {deleting ? 'Deleting…' : 'Yes, delete'}
      </button>
    </div>
  );
}

export default function Post() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetch(`${API}/api/posts/${id}`)
      .then(r => { if (!r.ok) throw new Error(); return r.json(); })
      .then(data => { setPost(data); setLoading(false); })
      .catch(() => { setError('Post not found.'); setLoading(false); });
  }, [id]);

  async function handleDelete() {
    setDeleting(true);
    try {
      await deletePost(id);
      navigate(post ? `/${post.category}` : '/');
    } catch {
      setDeleting(false);
      setConfirmDelete(false);
    }
  }

  if (loading) return (
    <div className="wrap" style={{ paddingTop: 140, paddingBottom: 100 }}>
      <p style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--text-muted)' }}>Loading…</p>
    </div>
  );

  if (error) return (
    <div className="wrap" style={{ paddingTop: 140, paddingBottom: 100 }}>
      <p style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: '#f87171' }}>{error}</p>
    </div>
  );

  const meta = CATEGORY_META[post.category] || CATEGORY_META.programming;
  const date = new Date(post.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div style={{ paddingTop: 80 }}>
      <article style={{ maxWidth: 'var(--max-w)', margin: '0 auto', padding: '0 24px' }}>

        <div style={{ paddingTop: 48, paddingBottom: 40, borderBottom: '1px solid var(--border)', marginBottom: 48 }}>

          {/* Top row: back + admin actions */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32, flexWrap: 'wrap', gap: 12 }}>
            <Link to={meta.back}
              style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-muted)', letterSpacing: '0.04em', display: 'inline-flex', alignItems: 'center', gap: 6, transition: 'color 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.color = meta.color}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}>
              ← Back to {meta.label}
            </Link>

            {isAdmin && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {confirmDelete ? (
                  <DeleteConfirm onConfirm={handleDelete} onCancel={() => setConfirmDelete(false)} deleting={deleting} />
                ) : (
                  <>
                    <Link to={`/edit/${id}`}
                      style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.04em', color: 'var(--text-muted)', background: 'transparent', border: '1px solid var(--border)', borderRadius: 6, padding: '6px 14px', display: 'inline-flex', alignItems: 'center', gap: 6, textDecoration: 'none', transition: 'color 0.15s, border-color 0.15s, background 0.15s' }}
                      onMouseEnter={e => { e.currentTarget.style.color = meta.color; e.currentTarget.style.borderColor = meta.color + '60'; e.currentTarget.style.background = meta.color + '0f'; }}
                      onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'transparent'; }}>
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                      Edit
                    </Link>
                    <button onClick={() => setConfirmDelete(true)}
                      style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.04em', color: 'var(--text-muted)', background: 'transparent', border: '1px solid var(--border)', borderRadius: 6, padding: '6px 14px', display: 'inline-flex', alignItems: 'center', gap: 6, cursor: 'pointer', transition: 'color 0.15s, border-color 0.15s, background 0.15s' }}
                      onMouseEnter={e => { e.currentTarget.style.color = '#ef4444'; e.currentTarget.style.borderColor = '#ef444440'; e.currentTarget.style.background = '#ef444410'; }}
                      onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'transparent'; }}>
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
                      Delete
                    </button>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Category + date */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
            <span className={`label ${meta.labelClass}`}>{meta.label}</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)' }}>
              {date} · {post.author}
            </span>
          </div>

          {/* Title */}
          <h1 style={{ fontSize: 'clamp(24px, 4vw, 40px)', fontWeight: 700, letterSpacing: '-0.03em', color: 'var(--text-bright)', lineHeight: 1.2, marginBottom: 24 }}>
            {post.title}
          </h1>

          {/* Tags */}
          {post.tags?.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {post.tags.map(tag => <TagBadge key={tag} tag={tag} category={post.category} />)}
            </div>
          )}
        </div>

        {/* Cover image */}
        {post.coverImage && (
          <div style={{ marginBottom: 48, borderRadius: 'var(--radius)', overflow: 'hidden', border: '1px solid var(--border)' }}>
            <img src={post.coverImage} alt="" style={{ width: '100%', maxHeight: 400, objectFit: 'cover', display: 'block' }} />
          </div>
        )}

        {/* Body */}
        <div className="post-body"
          style={{ fontSize: 16, lineHeight: 1.85, color: 'var(--text)', paddingBottom: 100 }}
          dangerouslySetInnerHTML={{ __html: post.content.startsWith('<') ? post.content : post.content.split('\n\n').map(p => `<p>${p}</p>`).join('') }}
        />
      </article>
    </div>
  );
}
