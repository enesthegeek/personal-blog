export default function TagBadge({ tag, category }) {
  const isNuclear = category === 'nuclear';
  return (
    <span style={{
      fontFamily: 'var(--font-mono)',
      fontSize: 10,
      letterSpacing: '0.04em',
      color: isNuclear ? 'var(--nuclear)' : 'var(--accent)',
      background: isNuclear ? 'var(--nuclear-dim)' : 'var(--accent-dim)',
      border: `1px solid ${isNuclear ? 'var(--nuclear-border)' : 'var(--accent-border)'}`,
      borderRadius: 4,
      padding: '2px 8px',
      whiteSpace: 'nowrap',
    }}>
      {tag}
    </span>
  );
}
