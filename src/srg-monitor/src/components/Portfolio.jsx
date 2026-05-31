import React from 'react';
import { Badge, Btn } from './UI';
import { fmt, fmtSGD, urgency } from '../utils';

const th = {
  padding: '9px 11px', textAlign: 'left', fontWeight: 600,
  fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.05em',
  color: 'var(--text-2)', background: 'var(--surface3)',
  borderBottom: '1px solid var(--border)', whiteSpace: 'nowrap',
};
const td = {
  padding: '9px 11px', borderBottom: '1px solid var(--border)', verticalAlign: 'middle',
};

export default function Portfolio({ data, onEdit, onDelete }) {
  const totKg    = data.reduce((a, b) => a + b.tonnage, 0);
  const totCV    = data.reduce((a, b) => a + b.tonnage * b.priceKg, 0);
  const totP     = data.reduce((a, b) => a + b.principal, 0);
  const totSGD   = data.reduce((a, b) => a + b.disbSGD, 0);
  const totInt   = data.reduce((a, b) => a + b.interest, 0);

  return (
    <div style={{ overflowX: 'auto', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', boxShadow: 'var(--shadow)' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
        <thead>
          <tr>
            {['#','Serial','Borrower','Type','Warehouse','Tonnage (kg)','Comm. Value (IDR)','Principal (IDR)','Disbursed (SGD)','Interest (IDR)','Maturity','Days','Status','Actions']
              .map(h => <th key={h} style={th}>{h}</th>)}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 && (
            <tr><td colSpan={14} style={{ ...td, textAlign: 'center', padding: '2rem', color: 'var(--text-2)' }}>
              No facilities yet. Click Add Facility to begin.
            </td></tr>
          )}
          {data.map((l, i) => {
            const days = l.daysLeft ?? 0;
            const urg = urgency(days);
            return (
              <tr key={l.id} style={{ background: i % 2 === 0 ? 'var(--surface)' : 'var(--bg)' }}>
                <td style={td}>{i + 1}</td>
                <td style={{ ...td, fontFamily: 'JetBrains Mono', fontSize: 11 }}>{l.serial}</td>
                <td style={{ ...td, maxWidth: 130, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: 12 }}>{l.borrower}</td>
                <td style={td}><Badge type={l.commodity === 'Arabica' ? 'ara' : 'rob'}>{l.commodity}</Badge></td>
                <td style={td}>{l.warehouse}</td>
                <td style={{ ...td, fontFamily: 'JetBrains Mono' }}>{fmt(l.tonnage)}</td>
                <td style={{ ...td, fontFamily: 'JetBrains Mono', fontSize: 11 }}>{fmt(l.tonnage * l.priceKg)}</td>
                <td style={{ ...td, fontFamily: 'JetBrains Mono', fontSize: 11 }}>{fmt(l.principal)}</td>
                <td style={{ ...td, fontFamily: 'JetBrains Mono', fontSize: 11 }}>{fmtSGD(l.disbSGD)}</td>
                <td style={{ ...td, fontFamily: 'JetBrains Mono', fontSize: 11 }}>{fmt(l.interest)}</td>
                <td style={{ ...td, whiteSpace: 'nowrap', fontSize: 12 }}>{l.maturity}</td>
                <td style={{ ...td, textAlign: 'center', fontWeight: 700 }}>{days}</td>
                <td style={td}><Badge type={urg}>{urg === 'urgent' ? 'Urgent' : urg === 'soon' ? 'Soon' : 'Active'}</Badge></td>
                <td style={{ ...td, whiteSpace: 'nowrap' }}>
                  <Btn small onClick={() => onEdit(l)} style={{ marginRight: 4 }}>Edit</Btn>
                  <Btn small danger onClick={() => onDelete(l.id)}>Delete</Btn>
                </td>
              </tr>
            );
          })}
        </tbody>
        <tfoot>
          <tr style={{ background: 'var(--surface3)', fontWeight: 700 }}>
            <td colSpan={5} style={{ ...td, color: 'var(--brand-dark)', fontSize: 12 }}>TOTAL ({data.length} facilities)</td>
            <td style={{ ...td, fontFamily: 'JetBrains Mono' }}>{fmt(totKg)}</td>
            <td style={{ ...td, fontFamily: 'JetBrains Mono', fontSize: 11 }}>{fmt(totCV)}</td>
            <td style={{ ...td, fontFamily: 'JetBrains Mono', fontSize: 11 }}>{fmt(totP)}</td>
            <td style={{ ...td, fontFamily: 'JetBrains Mono', fontSize: 11 }}>{fmtSGD(totSGD)}</td>
            <td style={{ ...td, fontFamily: 'JetBrains Mono', fontSize: 11 }}>{fmt(totInt)}</td>
            <td colSpan={4} />
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
