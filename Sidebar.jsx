import React from 'react';

const TABS = [
  { id: 'overview',  label: 'Overview',   icon: '▦' },
  { id: 'portfolio', label: 'Portfolio',  icon: '☰' },
  { id: 'facility',  label: 'Facility',   icon: '▐' },
  { id: 'maturity',  label: 'Maturity',   icon: '◷' },
  { id: 'add',       label: 'Add / Edit', icon: '＋', divider: true },
];

const s = {
  sidebar: {
    width: 192,
    flexShrink: 0,
    background: 'var(--sidebar-bg)',
    display: 'flex',
    flexDirection: 'column',
    paddingTop: 16,
    boxShadow: '2px 0 12px rgba(0,0,0,0.18)',
    overflowY: 'auto',
  },
  section: {
    fontSize: 9.5,
    color: 'rgba(168,212,179,0.4)',
    fontWeight: 700,
    letterSpacing: '0.10em',
    textTransform: 'uppercase',
    padding: '4px 18px 3px',
  },
  divider: { height: 1, background: 'rgba(255,255,255,0.07)', margin: '10px 0' },
  item: (active) => ({
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '10px 18px',
    fontSize: 13,
    color: active ? '#fff' : 'var(--sidebar-text)',
    background: active ? 'rgba(255,255,255,0.10)' : 'transparent',
    borderLeft: active ? '3px solid var(--brand-mid)' : '3px solid transparent',
    fontWeight: active ? 600 : 400,
    cursor: 'pointer',
    border: 'none',
    width: '100%',
    textAlign: 'left',
    fontFamily: 'inherit',
    transition: 'background 0.15s, color 0.15s',
  }),
  icon: { fontSize: 14, opacity: 0.7, width: 18, textAlign: 'center', flexShrink: 0 },
};

export default function Sidebar({ active, onChange }) {
  return (
    <nav style={s.sidebar}>
      <div style={s.section}>Monitor</div>
      {TABS.map((t) => (
        <React.Fragment key={t.id}>
          {t.divider && <div style={s.divider} />}
          {t.divider && <div style={s.section}>Data</div>}
          <button style={s.item(active === t.id)} onClick={() => onChange(t.id)}>
            <span style={s.icon}>{t.icon}</span>
            {t.label}
          </button>
        </React.Fragment>
      ))}
    </nav>
  );
}
