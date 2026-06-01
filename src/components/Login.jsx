import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import logo from '../logo.png';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      setError('Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0d3d1c 0%, #1e7c3a 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24,
    }}>
      <div style={{
        background: '#ffffff',
        borderRadius: 20,
        padding: '40px 36px',
        width: '100%',
        maxWidth: 400,
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <img src={logo} alt="PT Asli Pangan Indonesia" style={{ height: 56, width: 'auto' }} />
          <div style={{ fontSize: 18, fontWeight: 700, color: '#0d3d1c', marginTop: 12 }}>
            SRG Financing Monitor
          </div>
          <div style={{ fontSize: 12, color: '#7aaa87', marginTop: 4 }}>
            PT Asli Pangan Indonesia
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: '#3d6147', display: 'block', marginBottom: 6 }}>
              Email address
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              style={{
                width: '100%', padding: '10px 12px',
                border: '1.5px solid #d4eddb', borderRadius: 10,
                fontSize: 14, fontFamily: 'inherit', outline: 'none',
                transition: 'border 0.15s',
              }}
              onFocus={e => e.target.style.borderColor = '#1e7c3a'}
              onBlur={e => e.target.style.borderColor = '#d4eddb'}
            />
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: '#3d6147', display: 'block', marginBottom: 6 }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              style={{
                width: '100%', padding: '10px 12px',
                border: '1.5px solid #d4eddb', borderRadius: 10,
                fontSize: 14, fontFamily: 'inherit', outline: 'none',
                transition: 'border 0.15s',
              }}
              onFocus={e => e.target.style.borderColor = '#1e7c3a'}
              onBlur={e => e.target.style.borderColor = '#d4eddb'}
            />
          </div>

          {error && (
            <div style={{
              background: '#fde8e6', color: '#8c1f15', borderRadius: 8,
              padding: '10px 12px', fontSize: 12, marginBottom: 16,
              border: '1px solid #f5c6c3',
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%', padding: '12px',
              background: loading ? '#7aaa87' : '#1e7c3a',
              color: '#ffffff', border: 'none', borderRadius: 10,
              fontSize: 14, fontWeight: 600, fontFamily: 'inherit',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'background 0.15s',
            }}
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: 20, fontSize: 11, color: '#7aaa87' }}>
          Contact your administrator to reset your password
        </div>
      </div>
    </div>
  );
}
