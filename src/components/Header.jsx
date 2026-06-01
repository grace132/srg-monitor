import React from 'react';
import { signOut } from 'firebase/auth';
import { auth, isEditor } from '../firebase';
import logo from '../logo.png';

const s = {
  header: {
    background: 'var(--brand-darker)',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
    padding: '0 24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 60,
    position: 'sticky',
    top: 0,
    zIndex: 100,
    boxShadow: '0 2px 16px rgba(0,0,0,0.28)',
    flexShrink: 0,
  },
  left: { display: 'flex', alignItems: 'center', gap: 14 },
  logoImg: { height: 38, width: 'auto', display: 'block' },
  divider: { width: 1, height: 30, background: 'rgba(255,255,255,0.14)' },
  title: { fontSize: 14, fontWeight: 700, color: '#fff', letterSpacing: '0.01em' },
  sub: { fontSize: 11, color: 'rgba(168,212,179,0.75)', marginTop: 2 },
  right: { display: 'flex', alignItems: 'center', gap: 8 },
  badge: (saving) => ({
    fontSize: 11, padding: '3px 10px', borderRadius: 20,
    background: saving ? 'rgba(200,160,32,0.18)' : 'rgba(255,255,255,0.1)',
    color: saving ? 'var(--accent)' : '#a8d4b3',
    fontWeight: 500, border: '1px solid rgba(255,255,255,0.12)', transition: 'all 0.3s',
  }),
  roleBadge: (editor) => ({
    fontSize: 10, padding: '2px 8px', borderRadius: 20, fontWeight: 600,
    background: editor ? 'rgba(200,160,32,0.2)' : 'rgba(255,255,255,0.1)',
    color: editor ? '#c8a020' : '#a8d4b3',
    border: editor ? '1px solid rgba(200,160,32,0.3)' : '1px solid rgba(255,255,255,0.1)',
  }),
  userInfo: {
    fontSize: 11, color: 'rgba(168,212,179,0.8)',
    maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
  },
  btn: (primary) => ({
    fontSize: 12, padding: '6px 12px', borderRadius: 8,
    border: primary ? '1px solid rgba(255,255,255,0.2)' : '1px solid rgba(255,255,255,0.12)',
    background: primary ? 'rgba(255,255,255,0.14)' : 'rgba(255,255,255,0.07)',
    color: primary ? '#fff' : '#a8d4b3',
    fontWeight: 500, fontFamily: 'inherit', cursor: 'pointer',
    display: 'flex', alignItems: 'center', gap: 5, transition: 'background 0.15s',
  }),
};

export default function Header({ saveStatus, onAdd, onReset, onExport, user }) {
  const editor = isEditor(user?.email);

  const handleLogout = async () => {
    await signOut(auth);
  };

  return (
    <header style={s.header}>
      <div style={s.left}>
        <img src={logo} alt="PT Asli Pangan Indonesia" style={s.logoImg} />
        <div style={s.divider} />
        <div>
          <div style={s.title}>SRG Financing Monitor</div>
          <div style={s.sub}>Warehouse Receipt System · Auto-saved</div>
        </div>
      </div>
      <div style={s.right}>
        <span style={s.badge(saveStatus === 'saving')}>
          {saveStatus === 'saving' ? 'Saving…' : '✓ Saved'}
        </span>
        <span style={s.roleBadge(editor)}>{editor ? '✎ Editor' : '👁 Viewer'}</span>
        <span style={s.userInfo}>{user?.email}</span>
        {editor && (
          <>
            <button style={s.btn(true)} onClick={onAdd}>＋ Add</button>
            <button style={s.btn(false)} onClick={onExport}>↓ CSV</button>
            <button style={s.btn(false)} onClick={onReset}>↺ Reset</button>
          </>
        )}
        {!editor && (
          <button style={s.btn(false)} onClick={onExport}>↓ CSV</button>
        )}
        <button style={{ ...s.btn(false), color: '#f4a9a3' }} onClick={handleLogout}>⎋ Sign out</button>
      </div>
    </header>
  );
}
