import { useEffect, useState } from 'react';
import PostCard from '../components/PostCard';
import { API } from '../lib/api';

const META = {
  nuclear: {
    label: '⚛ Nuclear Writings',
    desc: 'Reactor physics, neutronics, safety systems, fuel cycles, and everything in between.',
    color: 'var(--nuclear)',
    dim: 'var(--nuclear-dim)',
    border: 'var(--nuclear-border)',
    labelClass: 'label--nuclear',
  },
  programming: {
    label: '</> Programming',
    desc: 'Web development, tooling, algorithms, and engineering software from a nuclear perspective.',
    color: 'var(--accent)',
    dim: 'var(--accent-dim)',
    border: 'var(--accent-border)',
    labelClass: 'label--accent',
  },
};

export default function CategoryPage({ category }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const meta = META[category];

  useEffect(() => {
    setLoading(true);
    fetch(`${API}/api/posts?category=${category}`)
      .then(r => r.json())
      .then(data => { setPosts(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [category]);

  return (
    <div style={{ paddingTop: 80 }}>
      {/* Header */}
      <section style={{ paddingTop: 64, paddingBottom: 48, borderBottom: '1px solid var(--border)' }}>
        <div className="wrap">
          <span className={`label ${meta.labelClass}`} style={{ marginBottom: 16 }}>{meta.label}</span>
          <h1 style={{
            fontSize: 'clamp(28px, 5vw, 48px)',
            fontWeight: 700,
            letterSpacing: '-0.03em',
            color: 'var(--text-bright)',
            marginBottom: 12,
            lineHeight: 1.15,
          }}>
            {category === 'nuclear' ? 'Nuclear Engineering' : 'Programming'}
          </h1>
          <p style={{ fontSize: 14, color: 'var(--text-dim)', maxWidth: 480, lineHeight: 1.7 }}>
            {meta.desc}
          </p>
        </div>
      </section>

      {/* Posts */}
      <section style={{ paddingTop: 48, paddingBottom: 100 }}>
        <div className="wrap">
          {loading ? (
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--text-muted)' }}>
              Loading…
            </p>
          ) : posts.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '80px 0',
              border: '1px dashed var(--border)',
              borderRadius: 'var(--radius)',
            }}>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--text-muted)' }}>
                No posts yet. Check back soon.
              </p>
            </div>
          ) : (
            <>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)', letterSpacing: '0.06em', marginBottom: 24 }}>
                {posts.length} {posts.length === 1 ? 'post' : 'posts'}
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {posts.map((post, i) => <PostCard key={post.id} post={post} index={i} />)}
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
