import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PostCard from '../components/PostCard';

const AtomSVG = () => (
  <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg"
    style={{ width: 320, height: 320, position: 'absolute', top: '50%', right: -60, transform: 'translateY(-55%) rotate(20deg)', opacity: 0.13, pointerEvents: 'none', color: 'var(--nuclear)' }}>
    <ellipse cx="100" cy="100" rx="90" ry="35" stroke="currentColor" strokeWidth="2"/>
    <ellipse cx="100" cy="100" rx="90" ry="35" stroke="currentColor" strokeWidth="2" transform="rotate(60 100 100)"/>
    <ellipse cx="100" cy="100" rx="90" ry="35" stroke="currentColor" strokeWidth="2" transform="rotate(120 100 100)"/>
    <circle cx="100" cy="100" r="8" fill="currentColor"/>
  </svg>
);

const CodeSVG = () => (
  <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg"
    style={{ width: 300, height: 300, position: 'absolute', top: '50%', left: -50, transform: 'translateY(-45%) rotate(-15deg)', opacity: 0.11, pointerEvents: 'none', color: 'var(--accent)' }}>
    {/* < bracket */}
    <polyline points="72,52 28,100 72,148" stroke="currentColor" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round"/>
    {/* > bracket */}
    <polyline points="128,52 172,100 128,148" stroke="currentColor" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round"/>
    {/* / slash */}
    <line x1="118" y1="40" x2="82" y2="160" stroke="currentColor" strokeWidth="8" strokeLinecap="round"/>
  </svg>
);

const categories = [
  {
    slug: 'nuclear',
    label: '⚛ Nuclear Writings',
    desc: 'Reactor physics, neutronics, fuel cycles, safety systems, and the science of splitting atoms.',
    color: 'var(--nuclear)',
    dim: 'var(--nuclear-dim)',
    border: 'var(--nuclear-border)',
    borderHover: 'var(--nuclear-border-hover)',
    glow: 'var(--nuclear-glow)',
    tags: ['reactor physics', 'neutronics', 'fuel cycles', 'safety'],
  },
  {
    slug: 'programming',
    label: '</> Programming',
    desc: 'Web development, algorithms, tools, and thoughts from a nuclear engineer who codes.',
    color: 'var(--accent)',
    dim: 'var(--accent-dim)',
    border: 'var(--accent-border)',
    borderHover: 'var(--accent-border-hover)',
    glow: 'var(--accent-glow)',
    tags: ['React', 'Node.js', 'algorithms', 'tooling'],
  },
];

function CategoryCard({ cat, index }) {
  const [hover, setHover] = useState(false);
  return (
    <Link to={`/${cat.slug}`} style={{ textDecoration: 'none', display: 'block', animationDelay: `${0.15 + index * 0.1}s` }} className="anim-fade-up">
      <div
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{
          background: 'var(--bg-card)',
          border: `1px solid ${hover ? cat.borderHover : cat.border}`,
          borderRadius: 'var(--radius)',
          padding: '32px 28px',
          transition: 'border-color 0.25s, box-shadow 0.25s, transform 0.2s',
          boxShadow: hover ? `0 0 0 1px ${cat.border}, 0 16px 48px ${cat.glow}` : 'none',
          transform: hover ? 'translateY(-3px)' : 'translateY(0)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 2,
          background: `linear-gradient(90deg, ${cat.color}, transparent)`,
          opacity: hover ? 1 : 0.4,
          transition: 'opacity 0.25s',
        }} />

        <div style={{ marginBottom: 16 }}>
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 11,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: cat.color,
          }}>
            {cat.label}
          </span>
        </div>

        <p style={{ fontSize: 13, color: 'var(--text-dim)', lineHeight: 1.7, marginBottom: 24 }}>
          {cat.desc}
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 24 }}>
          {cat.tags.map(t => (
            <span key={t} style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 10,
              color: cat.color,
              background: cat.dim,
              border: `1px solid ${cat.border}`,
              borderRadius: 4,
              padding: '2px 8px',
            }}>{t}</span>
          ))}
        </div>

        <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 12,
          color: cat.color,
          letterSpacing: '0.04em',
          display: 'flex',
          alignItems: 'center',
          gap: 6,
        }}>
          Read posts →
        </span>
      </div>
    </Link>
  );
}

export default function Home() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/posts')
      .then(r => r.json())
      .then(setPosts)
      .catch(() => {});
  }, []);

  return (
    <>
      {/* Hero */}
      <section style={{ position: 'relative', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingTop: 80, overflow: 'hidden' }}>
        <AtomSVG />
        <CodeSVG />
        <div className="wrap">
          <div className="anim-fade-up" style={{ animationDelay: '0s' }}>
            <span className="label label--nuclear" style={{ marginBottom: 20 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--nuclear)', boxShadow: '0 0 8px var(--nuclear)', animation: 'pulse 2.5s ease-in-out infinite', display: 'inline-block' }} />
              Nuclear Engineering &amp; Software
            </span>
          </div>

          <h1 className="anim-fade-up" style={{
            animationDelay: '0.07s',
            fontSize: 'clamp(36px, 6vw, 64px)',
            fontWeight: 700,
            letterSpacing: '-0.04em',
            lineHeight: 1.08,
            marginBottom: 20,
            background: 'linear-gradient(120deg, var(--text-bright) 50%, var(--nuclear) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            Writing at the intersection<br />of atoms &amp; algorithms.
          </h1>

          <p className="anim-fade-up" style={{
            animationDelay: '0.13s',
            fontSize: 16,
            color: 'var(--text-dim)',
            lineHeight: 1.75,
            maxWidth: 480,
            marginBottom: 52,
          }}>
            A nuclear engineer with a passion for software. These pages explore both worlds — from reactor physics to React, from neutronics to Node.js.
          </p>

          <div className="anim-fade-up" style={{ animationDelay: '0.18s', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {categories.map((cat, i) => <CategoryCard key={cat.slug} cat={cat} index={i} />)}
          </div>
        </div>
      </section>

      <div className="wrap"><div className="divider" /></div>

      {/* Latest Posts */}
      {posts.length > 0 && (
        <section style={{ paddingBottom: 100 }}>
          <div className="wrap">
            <div style={{ marginBottom: 32 }}>
              <span className="label label--accent" style={{ marginBottom: 12 }}>Latest</span>
              <h2 style={{ fontSize: 24, fontWeight: 600, color: 'var(--text-bright)', letterSpacing: '-0.02em' }}>
                Recent Posts
              </h2>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {posts.slice(0, 5).map((post, i) => (
                <PostCard key={post.id} post={post} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
