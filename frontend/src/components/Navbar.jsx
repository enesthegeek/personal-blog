import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme';
import { useAuth } from '../context/AuthContext';

const SunIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="5"/>
    <line x1="12" y1="1" x2="12" y2="3"/>
    <line x1="12" y1="21" x2="12" y2="23"/>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
    <line x1="1" y1="12" x2="3" y2="12"/>
    <line x1="21" y1="12" x2="23" y2="12"/>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
  </svg>
);

const MoonIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
  </svg>
);

const s = {
  nav: {
    position: 'fixed',
    top: 0, left: 0, right: 0,
    zIndex: 100,
    backdropFilter: 'blur(14px)',
    WebkitBackdropFilter: 'blur(14px)',
    borderBottom: '1px solid var(--border)',
    transition: 'background 0.25s',
  },
  inner: {
    maxWidth: 'var(--max-w)',
    margin: '0 auto',
    padding: '18px 24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logo: {
    display: 'flex',
    flexDirection: 'column',
    gap: 1,
    textDecoration: 'none',
  },
  logoMain: {
    fontFamily: 'var(--font-mono)',
    fontSize: 13,
    color: 'var(--accent)',
    letterSpacing: '0.05em',
    lineHeight: 1,
  },
  logoSub: {
    fontFamily: 'var(--font-mono)',
    fontSize: 10,
    color: 'var(--text-muted)',
    letterSpacing: '0.1em',
    lineHeight: 1,
  },
  right: {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
  },
  links: {
    display: 'flex',
    gap: 28,
    listStyle: 'none',
    alignItems: 'center',
    marginRight: 8,
  },
};

function NavItem({ to, children, accentVar }) {
  return (
    <NavLink
      to={to}
      style={({ isActive }) => ({
        fontFamily: 'var(--font-mono)',
        fontSize: 12,
        letterSpacing: '0.06em',
        color: isActive ? `var(${accentVar})` : 'var(--text-dim)',
        textTransform: 'uppercase',
        transition: 'color 0.2s',
        paddingBottom: 2,
        borderBottom: isActive ? `1px solid var(${accentVar})` : '1px solid transparent',
      })}
    >
      {children}
    </NavLink>
  );
}

function AdminControls() {
  const { isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [hover, setHover] = React.useState(false);
  const [logoutHover, setLogoutHover] = React.useState(false);

  if (isAdmin) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <NavLink
          to="/new"
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          style={({ isActive }) => ({
            fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: '0.04em',
            color: 'var(--accent)',
            border: `1px solid ${isActive || hover ? 'var(--accent-border-hover)' : 'var(--accent-border)'}`,
            borderRadius: 'var(--radius)', padding: '7px 16px',
            background: isActive || hover ? 'var(--accent-dim)' : 'transparent',
            boxShadow: hover ? '0 0 16px var(--accent-glow)' : 'none',
            transition: 'background 0.2s, border-color 0.2s, box-shadow 0.2s',
            display: 'flex', alignItems: 'center', gap: 6,
            textDecoration: 'none', whiteSpace: 'nowrap',
          })}
        >
          + Write
        </NavLink>
        <button
          onClick={() => { logout(); navigate('/'); }}
          onMouseEnter={() => setLogoutHover(true)}
          onMouseLeave={() => setLogoutHover(false)}
          title="Sign out"
          style={{
            fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.04em',
            color: logoutHover ? 'var(--text)' : 'var(--text-muted)',
            background: 'transparent', border: '1px solid transparent',
            borderRadius: 6, padding: '7px 10px', cursor: 'pointer',
            transition: 'color 0.15s',
          }}
        >
          Sign out
        </button>
      </div>
    );
  }

  return (
    <Link
      to="/login"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.06em',
        color: hover ? 'var(--text-dim)' : 'var(--text-muted)',
        textDecoration: 'none', transition: 'color 0.2s',
        textTransform: 'uppercase',
      }}
    >
      Admin
    </Link>
  );
}

function ThemeToggle({ theme, toggle }) {
  const [hover, setHover] = React.useState(false);
  return (
    <button
      onClick={toggle}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      style={{
        width: 36,
        height: 36,
        borderRadius: '50%',
        border: `1px solid ${hover ? 'var(--accent-border)' : 'var(--border-hover)'}`,
        background: hover ? 'var(--accent-dim)' : 'transparent',
        color: hover ? 'var(--accent)' : 'var(--text-dim)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        transition: 'color 0.2s, border-color 0.2s, background 0.2s, transform 0.25s',
        transform: hover ? 'rotate(22deg)' : 'rotate(0deg)',
        cursor: 'pointer',
      }}
    >
      {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
    </button>
  );
}

export default function Navbar() {
  const { theme, toggle } = useTheme();

  return (
    <nav style={{
      ...s.nav,
      background: theme === 'light' ? 'rgba(248,248,248,0.9)' : 'rgba(8,8,8,0.88)',
    }}>
      <div style={s.inner}>
        <Link to="/" style={s.logo}>
          <span style={s.logoMain}>enes.blog</span>
          <span style={s.logoSub}>nuclear &amp; software</span>
        </Link>

        <div style={s.right}>
          <ul style={s.links}>
            <li><NavItem to="/nuclear" accentVar="--nuclear">⚛ Nuclear</NavItem></li>
            <li><NavItem to="/programming" accentVar="--accent">{'</>'} Programming</NavItem></li>
          </ul>
          <AdminControls />
          <ThemeToggle theme={theme} toggle={toggle} />
        </div>
      </div>
    </nav>
  );
}
