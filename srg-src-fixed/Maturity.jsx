import React, { useMemo } from 'react';
import { MetricCard, Card, CardTitle, Badge } from './UI';
import { fmt, urgency } from '../utils';

const th = {
  padding: '9px 11px', textAlign: 'left', fontWeight: 600,
  fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.05em',
  color: 'var(--text-2)', background: 'var(--surface3)',
  borderBottom: '1px solid var(--border)', whiteSpace: 'nowrap',
};
const td = { padding: '9px 11px', borderBottom: '1px solid var(--border)', verticalAlign: 'middle' };

export default function Maturity({ data }) {
  const sorted = useMemo(() => [...data].sort((a, b) => (a.daysLeft ?? 0) - (b.daysLeft ?? 0)), [data]);

  const urgent = data.filter(l => (l.daysLeft ?? 0) <= 15).length;
  const soon   = data.filter(l => { const d = l.daysLeft ?? 0; return d > 15 && d <= 30; }).length;
  const ok     = data.filter(l => (l.daysLeft ?? 0) > 30).length;
  const urgP   = data.filter(l => (l.daysLeft ?? 0) <= 15).reduce((a, b) => a + b.principal, 0);

  // Group by maturity date
  const groups = {};
  sorted.forEach(l => {
    const key = l.maturity || 'TBD';
    if (!groups[key]) groups[key] = [];
    groups[key].push(l);
  });

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 16 }}>
        <MetricCard label="Urgent (≤15 days)" value={urgent} sub={'IDR ' + fmt(urgP)} danger={urgent > 0} />
        <MetricCard label="Soon (16–30 days)" value={soon} sub={soon + ' facilit' + (soon !== 1 ? 'ies' : 'y')} />
        <MetricCard label="On track (>30 days)" value={ok} sub={ok + ' facilit' + (ok !== 1 ? 'ies' : 'y')} success />
      </div>

      <Card>
        <CardTitle>Repayment timeline</CardTitle>
        {Object.entries(groups).map(([date, ls]) => {
          const days = ls[0].daysLeft ?? 0;
          const urg  = urgency(days);
          const dotColor = urg === 'urgent' ? 'var(--red)' : urg === 'soon' ? 'var(--accent)' : 'var(--brand)';
          const tot = ls.reduce((a, b) => a + b.principal, 0);
          const borrowers = [...new Set(ls.map(l => l.borrower.replace('PT ', '')))].join(', ');
          return (
            <div key={date} style={{ display: 'flex', gap: 12, marginBottom: 14, alignItems: 'flex-start' }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: dotColor, flexShrink: 0, marginTop: 4 }} />
              <div>
                <div style={{ fontSize: 13, fontWeight: 600 }}>
                  {date} — <span style={{ color: dotColor }}>{days} days remaining</span>
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-2)', marginTop: 2 }}>
                  {ls.length} facilit{ls.length > 1 ? 'ies' : 'y'} · {borrowers} · Total IDR {fmt(tot)}
                </div>
              </div>
            </div>
          );
        })}
      </Card>

      <div style={{ overflowX: 'auto', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', boxShadow: 'var(--shadow)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
          <thead>
            <tr>
              {['#','SRG Number','Borrower','Commodity','Principal (IDR)','Maturity Date','Days Left','Urgency']
                .map(h => <th key={h} style={th}>{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {sorted.map((l, i) => {
              const days = l.daysLeft ?? 0;
              const urg  = urgency(days);
              return (
                <tr key={l.id} style={{ background: i % 2 === 0 ? 'var(--surface)' : 'var(--bg)' }}>
                  <td style={td}>{i + 1}</td>
                  <td style={{ ...td, fontFamily: 'JetBrains Mono', fontSize: 11 }}>{l.srg}</td>
                  <td style={{ ...td, fontSize: 12 }}>{l.borrower}</td>
                  <td style={td}><Badge type={l.commodity === 'Arabica' ? 'ara' : 'rob'}>{l.commodity}</Badge></td>
                  <td style={{ ...td, fontFamily: 'JetBrains Mono', fontSize: 11 }}>{fmt(l.principal)}</td>
                  <td style={{ ...td, whiteSpace: 'nowrap' }}>{l.maturity}</td>
                  <td style={{ ...td, textAlign: 'center', fontWeight: 700 }}>{days}</td>
                  <td style={td}><Badge type={urg}>{urg === 'urgent' ? 'Urgent' : urg === 'soon' ? 'Soon' : 'Active'}</Badge></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
