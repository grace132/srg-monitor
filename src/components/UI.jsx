import React from 'react';

export function Card({ children, style }) {
  return (
    <div style={{
      background: 'var(--surface)',
      borderRadius: 'var(--radius-lg)',
      border: '1px solid var(--border)',
      padding: 20,
      marginBottom: 16,
      boxShadow: 'var(--shadow)',
      ...style,
    }}>
      {children}
    </div>
  );
}

export function CardTitle({ children }) {
  return (
    <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-2)', marginBottom: 14, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
      {children}
    </div>
  );
}

export function MetricCard({ label, value, sub, danger, success, accent }) {
  const valColor = danger ? 'var(--red)' : success ? 'var(--brand)' : accent ? 'var(--accent)' : 'var(--text)';
  return (
    <div style={{
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderLeft: '3px solid var(--brand-mid)',
      borderRadius: 'var(--radius)',
      padding: '14px 16px',
      boxShadow: 'var(--shadow)',
    }}>
      <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: 20, fontWeight: 700, color: valColor, lineHeight: 1.1 }}>{value}</div>
      {sub && <div style={{ fontSize: 11, color: 'var(--text-2)', marginTop: 4 }}>{sub}</div>}
    </div>
  );
}

export function Badge({ children, type = 'ok' }) {
  const styles = {
    ok:     { background: 'var(--green-bg)', color: 'var(--green-text)' },
    soon:   { background: 'var(--amber-bg)', color: 'var(--amber-text)' },
    urgent: { background: 'var(--red-bg)',   color: 'var(--red-text)' },
    rob:    { background: '#d4eddb',         color: '#145c2b' },
    ara:    { background: '#f0e6fc',         color: '#6b21a8' },
  };
  return (
    <span style={{
      fontSize: 10, padding: '2px 8px', borderRadius: 20, fontWeight: 600,
      whiteSpace: 'nowrap', display: 'inline-block',
      ...(styles[type] || styles.ok),
    }}>
      {children}
    </span>
  );
}

export function Btn({ children, primary, danger, small, onClick, style }) {
  return (
    <button onClick={onClick} style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: small ? '5px 10px' : '8px 14px',
      fontSize: small ? 11 : 13,
      fontWeight: 500, fontFamily: 'inherit', cursor: 'pointer',
      borderRadius: 8,
      border: danger ? '1px solid var(--red)' : primary ? '1px solid var(--brand)' : '1px solid var(--border-strong)',
      background: primary ? 'var(--brand)' : danger ? 'transparent' : 'var(--surface)',
      color: primary ? '#fff' : danger ? 'var(--red)' : 'var(--text)',
      transition: 'background 0.15s, opacity 0.15s',
      ...style,
    }}>
      {children}
    </button>
  );
}

export function ProgBar({ label, value, total, color = 'var(--brand)' }) {
  const pct = Math.min(100, (value / total) * 100).toFixed(1);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
      <div style={{ fontSize: 12, color: 'var(--text-2)', minWidth: 130, flexShrink: 0 }}>{label}</div>
      <div style={{ flex: 1, height: 20, background: 'var(--surface2)', borderRadius: 4, overflow: 'hidden' }}>
        <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: 6 }}>
          <span style={{ fontSize: 10, fontWeight: 600, color: '#fff' }}>{pct}%</span>
        </div>
      </div>
      <div style={{ fontSize: 11, minWidth: 120, textAlign: 'right', fontFamily: 'JetBrains Mono', color: 'var(--text-2)' }}>
        {typeof value === 'number' && value > 1000
          ? 'SGD ' + value.toLocaleString('en-US', { maximumFractionDigits: 0 })
          : value}
      </div>
    </div>
  );
}

export function KpiRow({ label, idr, sgd, bold, header }) {
  if (header) return (
    <div style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: '0.09em', color: 'var(--text-3)', padding: '10px 0 3px', textTransform: 'uppercase' }}>
      {label}
    </div>
  );
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
      padding: '7px 0', borderBottom: bold ? 'none' : '1px solid var(--border)',
      fontWeight: bold ? 700 : 400,
      borderTop: bold ? '1px solid var(--border-strong)' : 'none',
      marginTop: bold ? 4 : 0,
      paddingTop: bold ? 10 : 7,
    }}>
      <span style={{ fontSize: 13, color: bold ? 'var(--brand-dark)' : 'var(--text-2)' }}>{label}</span>
      <div style={{ textAlign: 'right' }}>
        <div style={{ fontSize: 12, fontFamily: 'JetBrains Mono' }}>IDR {Math.round(idr).toLocaleString('id-ID')}</div>
        <div style={{ fontSize: 11, color: 'var(--text-2)', fontFamily: 'JetBrains Mono', marginTop: 1 }}>
          ≈ SGD {sgd.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>
      </div>
    </div>
  );
}

export function PageHeader({ title, sub, children }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
      <div>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--brand-dark)' }}>{title}</h2>
        {sub && <div style={{ fontSize: 13, color: 'var(--text-2)', marginTop: 3 }}>{sub}</div>}
      </div>
      {children && <div style={{ display: 'flex', gap: 8 }}>{children}</div>}
    </div>
  );
}

export function SectionDivider() {
  return <div style={{ height: 1, background: 'var(--border)', margin: '16px 0' }} />;
}
