import React, { useMemo } from 'react';
import { MetricCard, Card, CardTitle, ProgBar, KpiRow, SectionDivider } from './UI';
import { fmtSGD, calcTotals } from '../utils';
import { FACILITY_SGD } from '../data';

const COLORS = ['#1e7c3a', '#c8a020', '#2d9e52', '#6b3fa0', '#b52b1e'];

export default function Facility({ data }) {
  const t = useMemo(() => calcTotals(data), [data]);
  const avail = FACILITY_SGD - t.totSGD;
  const pctU = ((t.totSGD / FACILITY_SGD) * 100).toFixed(1);

  const borrMap = {}, whMap = {};
  data.forEach(l => {
    borrMap[l.borrower] = (borrMap[l.borrower] || 0) + l.disbSGD;
    whMap[l.warehouse]  = (whMap[l.warehouse]  || 0) + l.disbSGD;
  });

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 16 }}>
        <MetricCard label="Facility Limit" value="SGD 1,510,000" sub="Total facility" />
        <MetricCard label="Utilized" value={fmtSGD(t.totSGD)} sub={pctU + '% of total'} />
        <MetricCard label="Available" value={fmtSGD(avail)} sub="Remaining headroom" success />
      </div>

      <Card>
        <CardTitle>Overall utilization</CardTitle>
        <ProgBar label="Utilized" value={t.totSGD} total={FACILITY_SGD} color="#1e7c3a" />
        <ProgBar label="Available" value={avail} total={FACILITY_SGD} color="#c8a020" />

        <SectionDivider />
        <CardTitle>By borrower</CardTitle>
        {Object.entries(borrMap).map(([n, v], i) => (
          <ProgBar key={n} label={n.replace('PT ', '')} value={v} total={FACILITY_SGD} color={COLORS[i % COLORS.length]} />
        ))}

        <SectionDivider />
        <CardTitle>By warehouse</CardTitle>
        {Object.entries(whMap).map(([n, v], i) => (
          <ProgBar key={n} label={n} value={v} total={FACILITY_SGD} color={COLORS[i % COLORS.length]} />
        ))}
      </Card>

      <Card>
        <CardTitle>Cost & income summary</CardTitle>
        <KpiRow header label="INCOME (API)" />
        <KpiRow label="Interest income"   idr={t.totIntIDR} sgd={t.totIntSGD} />
        <KpiRow label="Admin fees"         idr={t.totAdmIDR} sgd={t.totAdmSGD} />
        <KpiRow label="Total income"       idr={t.totIncIDR} sgd={t.totIncSGD} bold />
        <KpiRow header label="COST — paid to Bappebti" />
        <KpiRow label={`PHJ fees (${data.length} × IDR 110,000)`} idr={t.totPhjIDR} sgd={t.totPhjSGD} />
        <KpiRow header label="BOTTOM LINE" />
        <KpiRow label="Net income (est.)"  idr={t.netIDR} sgd={t.netSGD} bold />
      </Card>
    </div>
  );
}
