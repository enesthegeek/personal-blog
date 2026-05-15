import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { login as apiLogin } from '../lib/api';

export default function Login() {
  const { login, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/';

  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (isAdmin) {
    navigate(from, { replace: true });
    return null;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { token } = await apiLogin(password);
      login(token);
      navigate(from, { replace: true });
    } catch {
      setError('Incorrect password.');
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 24px' }}>
      <div style={{ width: '100%', maxWidth: 360 }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--accent)', letterSpacing: '0.05em' }}>
            enes.blog
          </span>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)', letterSpacing: '0.1em', marginTop: 4 }}>
            admin access
          </p>
        </div>

        {/* Card */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '32px 28px' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 8 }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                autoFocus
                placeholder="Enter admin password"
                style={{ width: '100%', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', color: 'var(--text)', fontFamily: 'var(--font-mono)', fontSize: 14, padding: '11px 14px', outline: 'none', transition: 'border-color 0.2s', boxSizing: 'border-box' }}
                onFocus={e => e.target.style.borderColor = 'var(--accent-border)'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'}
              />
            </div>

            {error && (
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: '#f87171', margin: 0 }}>{error}</p>
            )}

            <button type="submit" disabled={loading || !password}
              style={{ width: '100%', padding: '11px', background: 'linear-gradient(135deg, var(--accent) 0%, var(--accent-2) 100%)', border: 'none', borderRadius: 'var(--radius)', color: '#0a0a0a', fontFamily: 'var(--font-sans)', fontSize: 14, fontWeight: 600, cursor: loading || !password ? 'not-allowed' : 'pointer', opacity: loading || !password ? 0.5 : 1, transition: 'opacity 0.2s', marginTop: 4 }}>
              {loading ? 'Signing in…' : 'Sign in →'}
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)', marginTop: 20, letterSpacing: '0.04em' }}>
          Readers don't need an account.{' '}
          <a href="/" style={{ color: 'var(--accent)', textDecoration: 'none' }}>← Back to blog</a>
        </p>
      </div>
    </div>
  );
}
