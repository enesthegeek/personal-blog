import React, { useRef, useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Editor from '../components/Editor';
import { getPost, updatePost, uploadImage } from '../lib/api';

const SUGGESTED_TAGS = {
  nuclear: ['reactor physics', 'neutronics', 'fuel cycles', 'nuclear safety', 'radiation', 'thermal hydraulics', 'criticality', 'shielding', 'waste management', 'SMR'],
  programming: ['React', 'Node.js', 'JavaScript', 'Python', 'algorithms', 'REST API', 'web development', 'TypeScript', 'databases', 'DevOps'],
};

const inputStyle = {
  width: '100%',
  background: 'var(--bg-card)',
  border: '1px solid var(--border)',
  borderRadius: 'var(--radius)',
  color: 'var(--text)',
  fontFamily: 'var(--font-sans)',
  fontSize: 15,
  padding: '12px 16px',
  outline: 'none',
  transition: 'border-color 0.2s',
};

function Field({ label, mono, children }) {
  return (
    <div>
      <label style={{
        display: 'block',
        fontFamily: mono ? 'var(--font-mono)' : 'var(--font-sans)',
        fontSize: 11,
        letterSpacing: mono ? '0.1em' : '0.02em',
        textTransform: 'uppercase',
        color: 'var(--text-muted)',
        marginBottom: 8,
      }}>
        {label}
      </label>
      {children}
    </div>
  );
}

export default function EditPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const coverInputRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('programming');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [coverPreview, setCoverPreview] = useState(null);
  const [coverUrl, setCoverUrl] = useState('');
  const [coverLoading, setCoverLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    getPost(id)
      .then(post => {
        setCategory(post.category);
        setTitle(post.title);
        setContent(post.content);
        setTags(post.tags || []);
        if (post.coverImage) {
          setCoverPreview(post.coverImage);
          setCoverUrl(post.coverImage);
        }
        setLoading(false);
      })
      .catch(() => { setError('Failed to load post.'); setLoading(false); });
  }, [id]);

  const accent = category === 'nuclear' ? 'var(--nuclear)' : 'var(--accent)';
  const accentBorder = category === 'nuclear' ? 'var(--nuclear-border)' : 'var(--accent-border)';
  const accentDim = category === 'nuclear' ? 'var(--nuclear-dim)' : 'var(--accent-dim)';
  const accentGlow = category === 'nuclear' ? 'var(--nuclear-glow)' : 'var(--accent-glow)';

  async function handleCoverFile(file) {
    if (!file) return;
    setCoverLoading(true);
    try {
      setCoverPreview(URL.createObjectURL(file));
      const url = await uploadImage(file);
      setCoverUrl(url);
    } catch {
      setError('Cover image upload failed.');
    } finally {
      setCoverLoading(false);
    }
  }

  const suggestions = (SUGGESTED_TAGS[category] || []).filter(
    s => !tags.includes(s) && s.toLowerCase().includes(tagInput.toLowerCase()) && tagInput.length > 0
  );

  function addTag(tag) {
    const t = tag.trim();
    if (!t || tags.includes(t) || tags.length >= 5) return;
    setTags(prev => [...prev, t]);
    setTagInput('');
  }

  function handleTagKey(e) {
    if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); addTag(tagInput); }
    else if (e.key === 'Backspace' && !tagInput) setTags(prev => prev.slice(0, -1));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim()) { setError('Title is required.'); return; }
    if (!content || content === '<p></p>') { setError('Content cannot be empty.'); return; }
    setSubmitting(true);
    setError('');
    try {
      await updatePost(id, { title: title.trim(), content, category, tags, coverImage: coverUrl });
      navigate(`/post/${id}`);
    } catch {
      setError('Failed to save. Make sure the backend is running.');
      setSubmitting(false);
    }
  }

  if (loading) return (
    <div className="wrap" style={{ paddingTop: 140 }}>
      <p style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--text-muted)' }}>Loading…</p>
    </div>
  );

  return (
    <div style={{ paddingTop: 80 }}>
      <div className="wrap" style={{ paddingTop: 48, paddingBottom: 100 }}>
        <div style={{ marginBottom: 40 }}>
          <span className={`label label--${category === 'nuclear' ? 'nuclear' : 'accent'}`} style={{ marginBottom: 12 }}>
            Edit Post
          </span>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: 'var(--text-bright)', letterSpacing: '-0.02em' }}>
            Edit post
          </h1>
        </div>

        {error && <p style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: '#f87171', marginBottom: 24 }}>{error}</p>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>

          {/* Category */}
          <Field label="Category" mono>
            <div style={{ display: 'flex', gap: 10 }}>
              {['nuclear', 'programming'].map(cat => {
                const active = category === cat;
                const col = cat === 'nuclear' ? 'var(--nuclear)' : 'var(--accent)';
                const bdr = cat === 'nuclear' ? 'var(--nuclear-border)' : 'var(--accent-border)';
                const dim = cat === 'nuclear' ? 'var(--nuclear-dim)' : 'var(--accent-dim)';
                const [hover, setHover] = React.useState(false);
                return (
                  <button key={cat} type="button" onClick={() => setCategory(cat)}
                    onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
                    style={{
                      padding: '8px 20px',
                      border: `1px solid ${active ? bdr : hover ? bdr : 'var(--border)'}`,
                      borderRadius: 'var(--radius)',
                      background: active ? dim : hover ? dim : 'transparent',
                      color: active ? col : hover ? col : 'var(--text-muted)',
                      fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: '0.06em',
                      textTransform: 'uppercase', cursor: 'pointer', transition: 'all 0.15s',
                    }}>
                    {cat === 'nuclear' ? '⚛ Nuclear' : '</> Programming'}
                  </button>
                );
              })}
            </div>
          </Field>

          {/* Title */}
          <Field label="Title" mono>
            <input type="text" placeholder="Post title…" value={title} onChange={e => setTitle(e.target.value)}
              style={{ ...inputStyle, fontSize: 20, fontWeight: 600, letterSpacing: '-0.01em', color: 'var(--text-bright)' }}
              onFocus={e => e.target.style.borderColor = accentBorder}
              onBlur={e => e.target.style.borderColor = 'var(--border)'} />
          </Field>

          {/* Cover image */}
          <Field label="Cover Image" mono>
            <div onClick={() => !coverLoading && coverInputRef.current?.click()}
              onDrop={e => { e.preventDefault(); handleCoverFile(e.dataTransfer.files[0]); }}
              onDragOver={e => e.preventDefault()}
              style={{
                border: `1px dashed ${coverPreview ? accentBorder : 'var(--border)'}`,
                borderRadius: 'var(--radius)', background: coverPreview ? 'transparent' : 'var(--bg-card)',
                cursor: coverLoading ? 'wait' : 'pointer', overflow: 'hidden', transition: 'border-color 0.2s',
                minHeight: coverPreview ? 0 : 120, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative',
              }}>
              {coverPreview ? (
                <>
                  <img src={coverPreview} alt="Cover" style={{ width: '100%', maxHeight: 280, objectFit: 'cover', display: 'block' }} />
                  <button type="button" onClick={e => { e.stopPropagation(); setCoverPreview(null); setCoverUrl(''); }}
                    style={{ position: 'absolute', top: 10, right: 10, background: 'rgba(0,0,0,0.6)', border: 'none', borderRadius: '50%', width: 28, height: 28, color: '#fff', fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    ✕
                  </button>
                </>
              ) : (
                <div style={{ textAlign: 'center', padding: '32px 24px' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: 10 }}>
                    <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
                  </svg>
                  <p style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-muted)' }}>
                    {coverLoading ? 'Uploading…' : 'Click or drag & drop a cover image'}
                  </p>
                </div>
              )}
            </div>
            <input ref={coverInputRef} type="file" accept="image/*" style={{ display: 'none' }}
              onChange={e => { handleCoverFile(e.target.files[0]); e.target.value = ''; }} />
          </Field>

          {/* Tags */}
          <Field label={`Tags (${tags.length}/5)`} mono>
            {tags.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 10 }}>
                {tags.map(tag => (
                  <span key={tag} style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: accent, background: accentDim, border: `1px solid ${accentBorder}`, borderRadius: 4, padding: '3px 10px', display: 'flex', alignItems: 'center', gap: 6 }}>
                    {tag}
                    <button type="button" onClick={() => setTags(tags.filter(t => t !== tag))}
                      style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', padding: 0, lineHeight: 1, fontSize: 12 }}>✕</button>
                  </span>
                ))}
              </div>
            )}
            <div style={{ position: 'relative' }}>
              <input type="text"
                placeholder={tags.length >= 5 ? 'Max 5 tags reached' : 'Type a tag and press Enter…'}
                value={tagInput} disabled={tags.length >= 5}
                onChange={e => setTagInput(e.target.value)} onKeyDown={handleTagKey}
                style={{ ...inputStyle, opacity: tags.length >= 5 ? 0.4 : 1, cursor: tags.length >= 5 ? 'not-allowed' : 'text' }}
                onFocus={e => e.target.style.borderColor = accentBorder}
                onBlur={e => e.target.style.borderColor = 'var(--border)'} />
              {suggestions.length > 0 && (
                <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 10, background: 'var(--bg-card)', border: '1px solid var(--border)', borderTop: 'none', borderRadius: '0 0 var(--radius) var(--radius)', overflow: 'hidden' }}>
                  {suggestions.slice(0, 5).map(s => (
                    <button key={s} type="button" onClick={() => addTag(s)}
                      style={{ display: 'block', width: '100%', textAlign: 'left', padding: '9px 16px', background: 'none', border: 'none', borderBottom: '1px solid var(--border)', fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-dim)', cursor: 'pointer', transition: 'background 0.1s, color 0.1s' }}
                      onMouseEnter={e => { e.currentTarget.style.background = accentDim; e.currentTarget.style.color = accent; }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = 'var(--text-dim)'; }}>
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </Field>

          {/* Editor — pre-filled with existing content */}
          <Field label="Content" mono>
            <Editor onChange={setContent} initialContent={content} />
          </Field>

          {/* Actions */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
            <button type="button" onClick={() => navigate(`/post/${id}`)}
              style={{ padding: '12px 24px', background: 'transparent', border: '1px solid var(--border)', borderRadius: 'var(--radius)', color: 'var(--text-dim)', fontFamily: 'var(--font-sans)', fontSize: 14, cursor: 'pointer', transition: 'border-color 0.2s, color 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-hover)'; e.currentTarget.style.color = 'var(--text)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-dim)'; }}>
              Cancel
            </button>
            <button type="submit" disabled={submitting}
              style={{ padding: '12px 32px', background: `linear-gradient(135deg, ${accent} 0%, ${accentBorder} 100%)`, border: 'none', borderRadius: 'var(--radius)', color: '#0a0a0a', fontFamily: 'var(--font-sans)', fontSize: 14, fontWeight: 600, cursor: submitting ? 'wait' : 'pointer', opacity: submitting ? 0.7 : 1, transition: 'opacity 0.2s, transform 0.15s, box-shadow 0.2s', letterSpacing: '0.01em' }}
              onMouseEnter={e => { if (!submitting) { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = `0 8px 28px ${accentGlow}`; }}}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}>
              {submitting ? 'Saving…' : 'Save changes →'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
