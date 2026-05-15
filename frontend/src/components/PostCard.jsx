import { Link } from 'react-router-dom';
import TagBadge from './TagBadge';

const CATEGORY_META = {
  nuclear:      { label: '⚛ Nuclear',      color: 'var(--nuclear)',       border: 'var(--nuclear-border)',       glow: 'var(--nuclear-glow)' },
  programming:  { label: '</> Programming', color: 'var(--accent)',        border: 'var(--accent-border)',        glow: 'var(--accent-glow)' },
};

export default function PostCard({ post, index = 0 }) {
  const meta = CATEGORY_META[post.category] || CATEGORY_META.programming;
  const date = new Date(post.createdAt).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
  });

  return (
    <Link to={`/post/${post.id}`} style={{ display: 'block', textDecoration: 'none' }}>
      <article style={{
        position: 'relative',
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius)',
        padding: '28px 32px',
        display: 'grid',
        gridTemplateColumns: '1fr auto',
        alignItems: 'start',
        gap: 24,
        transition: 'border-color 0.25s, box-shadow 0.25s, transform 0.2s',
        overflow: 'hidden',
        animationDelay: `${index * 0.07}s`,
      }}
        onMouseEnter={e => {
          e.currentTarget.style.borderColor = meta.border;
          e.currentTarget.style.boxShadow = `0 0 0 1px ${meta.border}, 0 12px 40px ${meta.glow}`;
          e.currentTarget.style.transform = 'translateY(-2px)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.borderColor = 'var(--border)';
          e.currentTarget.style.boxShadow = 'none';
          e.currentTarget.style.transform = 'translateY(0)';
        }}
      >
        {/* Left accent bar */}
        <span style={{
          position: 'absolute',
          top: 0, bottom: 0, left: 0,
          width: 3,
          background: meta.color,
          borderRadius: '4px 0 0 4px',
          opacity: 0.5,
        }} />

        <div style={{ paddingLeft: 4, minWidth: 0 }}>
          {/* Meta row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 10,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              color: meta.color,
              background: `${meta.color}14`,
              border: `1px solid ${meta.border}`,
              borderRadius: 3,
              padding: '2px 8px',
              flexShrink: 0,
            }}>
              {meta.label}
            </span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)' }}>
              {date}
            </span>
          </div>

          {/* Title */}
          <h2 style={{
            fontSize: 16,
            fontWeight: 600,
            color: 'var(--text-bright)',
            letterSpacing: '-0.01em',
            marginBottom: 8,
            lineHeight: 1.35,
          }}>
            {post.title}
          </h2>

          {/* Excerpt — strip HTML tags for plain text preview */}
          <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.65, marginBottom: 16 }}>
            {post.content.replace(/<[^>]+>/g, '').slice(0, 140)}
            {post.content.replace(/<[^>]+>/g, '').length > 140 ? '…' : ''}
          </p>

          {/* Tags */}
          {post.tags?.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {post.tags.map(tag => <TagBadge key={tag} tag={tag} category={post.category} />)}
            </div>
          )}
        </div>

        {/* Cover thumbnail */}
        {post.coverImage && (
          <img
            src={post.coverImage}
            alt=""
            style={{
              width: 80,
              height: 80,
              objectFit: 'cover',
              borderRadius: 6,
              border: '1px solid var(--border)',
              flexShrink: 0,
              alignSelf: 'center',
            }}
          />
        )}

        {/* Arrow */}
        <span style={{ fontSize: 18, color: 'var(--text-muted)', marginTop: 2, transition: 'color 0.2s' }}>
          →
        </span>
      </article>
    </Link>
  );
}
