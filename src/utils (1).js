export const fmt = (n) => Math.round(n).toLocaleString('id-ID');
export const fmtSGD = (n) =>
  'SGD ' + parseFloat(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
export const fmtIDR = (n) => 'IDR ' + fmt(n);

export const calcDaysLeft = (maturity) => {
  if (!maturity) return 0;
  return Math.max(0, Math.round((new Date(maturity) - new Date()) / 86400000));
};

export const urgency = (days) => {
  if (days <= 15) return 'urgent';
  if (days <= 30) return 'soon';
  return 'ok';
};

export const calcTotals = (data) => {
  // Active only — excludes Repaid facilities from all totals
  const active = data.filter(l => l.status !== 'Repaid');

  const totKg      = active.reduce((a, b) => a + b.tonnage, 0);
  const totPrinc   = active.reduce((a, b) => a + b.principal, 0);
  const totSGD     = active.reduce((a, b) => a + b.disbSGD, 0);
  const totCommVal = active.reduce((a, b) => a + b.tonnage * b.priceKg, 0);
  const totIntIDR  = active.reduce((a, b) => a + b.interest, 0);
  const totIntSGD  = active.reduce((a, b) => a + b.interest / (b.fx || 13700), 0);
  const totAdmIDR  = active.reduce((a, b) => a + (b.adminFee || 0), 0);
  const totAdmSGD  = active.reduce((a, b) => a + (b.adminFee || 0) / (b.fx || 13700), 0);
  const totPhjIDR  = active.reduce((a, b) => a + (b.phjFee || 0), 0);
  const totPhjSGD  = active.reduce((a, b) => a + (b.phjFee || 0) / (b.fx || 13700), 0);
  const totIncIDR  = totIntIDR + totAdmIDR;
  const totIncSGD  = totIntSGD + totAdmSGD;
  const netIDR     = totIncIDR - totPhjIDR;
  const netSGD     = totIncSGD - totPhjSGD;

  // Repaid totals — for reference/display
  const repaid     = data.filter(l => l.status === 'Repaid');
  const totRepaidSGD = repaid.reduce((a, b) => a + b.disbSGD, 0);

  return {
    totKg, totPrinc, totSGD, totCommVal,
    totIntIDR, totIntSGD, totAdmIDR, totAdmSGD,
    totPhjIDR, totPhjSGD, totIncIDR, totIncSGD,
    netIDR, netSGD,
    totRepaidSGD,
    activeCount: active.length,
    repaidCount: repaid.length,
  };
};
