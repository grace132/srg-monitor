import React, { useMemo } from 'react';
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis,
  Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { MetricCard, Card, CardTitle } from './UI';
import { fmt, fmtSGD, calcTotals } from '../utils';
import { FACILITY_SGD } from '../data';

const COLORS = ['#1e7c3a', '#c8a020', '#2d9e52', '#6b3fa0', '#b52b1e'];

const CustomTooltip = ({ active, payload, prefix = '' }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 8, padding: '8px 12px', fontSize: 12, boxShadow: 'var(--shadow-md)' }}>
      <div style={{ fontWeight: 600 }}>{payload[0].name}</div>
      <div style={{ color: 'var(--text-2)' }}>{prefix}{Number(payload[0].value).toLocaleString('id-ID')}</div>
    </div>
  );
};

export default function Overview({ data }) {
  const t = useMemo(() => calcTotals(data), [data]);
  const avail = FACILITY_SGD - t.totSGD;
  const pct = ((t.totSGD / FACILITY_SGD) * 100).toFixed(1);
  const urgent = data.filter(l => (l.daysLeft ?? 0) <= 30).length;

  const commMap = {};
  data.forEach(l => { commMap[l.commodity] = (commMap[l.commodity] || 0) + l.tonnage; });
  const commData = Object.entries(commMap).map(([name, value]) => ({ name, value }));

  const borrMap = {};
  data.forEach(l => { borrMap[l.borrower] = (borrMap[l.borrower] || 0) + l.principal; });
  const borrData = Object.entries(borrMap).map(([name, value]) => ({
    name: name.replace('PT ', ''),
    value,
  }));

  const matData = data.map(l => ({
    name: l.serial,
    days: l.daysLeft ?? 0,
    fill: (l.daysLeft ?? 0) <= 15 ? '#b52b1e' : (l.daysLeft ?? 0) <= 30 ? '#c8a020' : '#1e7c3a',
  }));

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12, marginBottom: 16 }}>
        <MetricCard label="Total Coffee (SRG)" value={fmt(t.totKg) + ' kg'} sub={data.length + ' warehouse receipts'} />
        <MetricCard label="Loan Principal" value={'IDR ' + (t.totPrinc / 1e9).toFixed(2) + 'B'} sub={fmt(t.totPrinc)} />
        <MetricCard label="Disbursed (SGD)" value={fmtSGD(t.totSGD)} sub={'of SGD 1,510,000'} />
        <MetricCard label="Available" value={fmtSGD(avail)} sub="Remaining headroom" success />
        <MetricCard label="Commodity Value" value={'IDR ' + (t.totCommVal / 1e9).toFixed(1) + 'B'} sub="Avg LTV 70%" />
        <MetricCard label="Maturing ≤30d" value={urgent} sub={urgent + ' facilit' + (urgent !== 1 ? 'ies' : 'y')} danger={urgent > 0} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        <Card>
          <CardTitle>Coffee by commodity (kg)</CardTitle>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={commData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value">
                {commData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
              </Pie>
              <Tooltip content={<CustomTooltip prefix="" />} />
              <Legend formatter={(v) => <span style={{ fontSize: 12, color: 'var(--text-2)' }}>{v}</span>} />
            </PieChart>
          </ResponsiveContainer>
        </Card>
        <Card>
          <CardTitle>Loan by borrower (IDR)</CardTitle>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={borrData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value">
                {borrData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
              </Pie>
              <Tooltip formatter={(v) => 'IDR ' + Number(v).toLocaleString('id-ID')} />
              <Legend formatter={(v) => <span style={{ fontSize: 11, color: 'var(--text-2)' }}>{v}</span>} />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <Card>
        <CardTitle>Days remaining per facility</CardTitle>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={matData} margin={{ top: 5, right: 10, left: 0, bottom: 30 }}>
            <XAxis dataKey="name" tick={{ fontSize: 10, fill: 'var(--text-3)' }} angle={-35} textAnchor="end" interval={0} />
            <YAxis tick={{ fontSize: 10, fill: 'var(--text-3)' }} label={{ value: 'Days', angle: -90, position: 'insideLeft', style: { fontSize: 10 } }} />
            <Tooltip formatter={(v) => [v + ' days', 'Remaining']} />
            <Bar dataKey="days" radius={[4, 4, 0, 0]}>
              {matData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}
