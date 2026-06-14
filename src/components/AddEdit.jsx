import React, { useState, useEffect } from 'react';
import { Card, CardTitle, Btn } from './UI';
import { fmt, fmtSGD } from '../utils';
import { FACILITY_SGD } from '../data';

const Field = ({ label, id, type = 'text', value, onChange, placeholder, step }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
    <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-2)' }} htmlFor={id}>{label}</label>
    <input
      id={id} type={type} value={value} onChange={e => onChange(e.target.value)}
      placeholder={placeholder} step={step}
      style={{
        padding: '8px 10px', border: '1px solid var(--border-strong)', borderRadius: 8,
        fontSize: 13, fontFamily: 'inherit', background: 'var(--surface)', color: 'var(--text)',
        outline: 'none', transition: 'border 0.15s',
      }}
      onFocus={e => e.target.style.borderColor = 'var(--brand)'}
      onBlur={e => e.target.style.borderColor = 'var(--border-strong)'}
    />
  </div>
);

const Select = ({ label, id, value, onChange, options }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
    <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-2)' }} htmlFor={id}>{label}</label>
    <select id={id} value={value} onChange={e => onChange(e.target.value)} style={{
      padding: '8px 10px', border: '1px solid var(--border-strong)', borderRadius: 8,
      fontSize: 13, fontFamily: 'inherit', background: 'var(--surface)', color: 'var(--text)',
    }}>
      {options.map(o => <option key={o}>{o}</option>)}
    </select>
  </div>
);

const SectionTitle = ({ children }) => (
  <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10, paddingBottom: 8, borderBottom: '1px solid var(--border)' }}>
    {children}
  </div>
);

const Grid2 = ({ children }) => (
  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>{children}</div>
);
const Grid3 = ({ children }) => (
  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 12 }}>{children}</div>
);

const EMPTY = {
  srg: '', serial: '', borrower: '', commodity: 'Robusta', warehouse: '', grade: '', phj: '',
  tonnage: '', priceKg: '', ltv: '70', tenor: '1', rate: '3', fx: '13700',
  disbDate: '', whFee: '', insFid: '', adminFee: '', phjFee: '110000',
  status: 'Active', repaymentDate: '',
};

export default function AddEdit({ data, editing, onSave, onCancel, onEdit, onDelete }) {
  const [form, setForm] = useState(EMPTY);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (editing) {
      setForm({
        ...editing,
        tonnage: String(editing.tonnage || ''),
        priceKg: String(editing.priceKg || ''),
        ltv: String(editing.ltv || 70),
        tenor: String(editing.tenor || 1),
        rate: String(editing.rate || 3),
        fx: String(editing.fx || 13700),
        whFee: String(editing.whFee || ''),
        insFid: String(editing.insFid || ''),
        adminFee: String(editing.adminFee || ''),
        phjFee: String(editing.phjFee || 110000),
        status: editing.status || 'Active',
        repaymentDate: editing.repaymentDate || '',
      });
    } else {
      setForm(EMPTY);
    }
  }, [editing]);

  const set = (key) => (val) => setForm(f => ({ ...f, [key]: val }));

  useEffect(() => {
    const t = parseFloat(form.tonnage) || 0;
    const p = parseFloat(form.priceKg) || 0;
    const ltv = (parseFloat(form.ltv) || 70) / 100;
    const tenor = parseFloat(form.tenor) || 1;
    const rate = (parseFloat(form.rate) || 3) / 100;
    const fx = parseFloat(form.fx) || 13700;
    if (!t || !p) { setPreview(null); return; }
    const commVal = t * p;
    const principal = commVal * ltv;
    const interest = principal * rate * tenor;
    const disbSGD = principal / fx;
    const currentSGD = data.filter(l => !editing || l.id !== editing.id).reduce((a, b) => a + b.disbSGD, 0);
    setPreview({ commVal, principal, interest, disbSGD, headroom: FACILITY_SGD - currentSGD - disbSGD });
  }, [form, data, editing]);

  const handleSave = () => {
    if (!form.borrower.trim()) { alert('This field is required.'); return; }
    if (form.status === 'Repaid' && !form.repaymentDate) {
      alert('Please enter the Repayment Date for a Repaid facility.');
      return;
    }
    const t = parseFloat(form.tonnage) || 0;
    const p = parseFloat(form.priceKg) || 0;
    const ltv = (parseFloat(form.ltv) || 70) / 100;
    const tenor = parseFloat(form.tenor) || 1;
    const rate = (parseFloat(form.rate) || 3) / 100;
    const fx = parseFloat(form.fx) || 13700;
    const principal = t * p * ltv;
    const interest = principal * rate * tenor;
    const disbSGD = principal / fx;
    let maturity = '', daysLeft = 0;
    if (form.disbDate) {
      const mat = new Date(form.disbDate);
      mat.setMonth(mat.getMonth() + tenor);
      maturity = mat.toISOString().split('T')[0];
      // If Repaid, daysLeft = 0
      daysLeft = form.status === 'Repaid'
        ? 0
        : Math.max(0, Math.round((mat - new Date()) / 86400000));
    }
    onSave({
      srg: form.srg, serial: form.serial, borrower: form.borrower,
      commodity: form.commodity, warehouse: form.warehouse, grade: form.grade, phj: form.phj,
      tonnage: t, priceKg: p, ltv: parseFloat(form.ltv), tenor, rate: parseFloat(form.rate), fx,
      principal, interest, disbSGD,
      whFee: parseFloat(form.whFee) || 0, insFid: parseFloat(form.insFid) || 0,
      adminFee: parseFloat(form.adminFee) || 0, phjFee: parseFloat(form.phjFee) || 110000,
      disbDate: form.disbDate, maturity, daysLeft,
      status: form.status,
      repaymentDate: form.status === 'Repaid' ? form.repaymentDate : '',
    });
    setForm(EMPTY);
  };

  const isRepaid = form.status === 'Repaid';

  const th = {
    padding: '8px 10px', textAlign: 'left', fontWeight: 600, fontSize: 10,
    textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-2)',
    background: 'var(--surface3)', borderBottom: '1px solid var(--border)',
  };
  const td = { padding: '8px 10px', borderBottom: '1px solid var(--border)', verticalAlign: 'middle' };

  return (
    <div>
      <Card>
        <CardTitle>{editing ? `Edit facility — ${editing.serial}` : '+ Add New Facility'}</CardTitle>

        <div style={{ marginBottom: 16 }}><SectionTitle>Identification</SectionTitle>
          <Grid2>
            <Field label="Borrower / owner" id="borrower" value={form.borrower} onChange={set('borrower')} placeholder="Company Name" />
            <Field label="No. SRG" id="srg" value={form.srg} onChange={set('srg')} placeholder="00900205260012" />
            <Field label="No. Seri" id="serial" value={form.serial} onChange={set('serial')} placeholder="AN015812" />
            <Field label="No. PHJ" id="phj" value={form.phj} onChange={set('phj')} placeholder="014/DIR/API-KBI/V/2026" />
          </Grid2>
        </div>

        <div style={{ marginBottom: 16 }}><SectionTitle>Commodity & Warehouse</SectionTitle>
          <Grid3>
            <Select label="Commodity" id="commodity" value={form.commodity} onChange={set('commodity')} options={['Robusta', 'Arabica']} />
            <Field label="Warehouse" id="warehouse" value={form.warehouse} onChange={set('warehouse')} placeholder="Cianjur" />
            <Field label="Grade / Remark" id="grade" value={form.grade} onChange={set('grade')} placeholder="Robusta Grade 6" />
          </Grid3>
        </div>

        <div style={{ marginBottom: 16 }}><SectionTitle>Loan Structure (auto-calculated)</SectionTitle>
          <Grid3>
            <Field label="Tonnage (kg)" id="tonnage" type="number" value={form.tonnage} onChange={set('tonnage')} placeholder="61000" />
            <Field label="Price/kg (IDR)" id="priceKg" type="number" value={form.priceKg} onChange={set('priceKg')} placeholder="53500" />
            <Field label="LTV (%)" id="ltv" type="number" value={form.ltv} onChange={set('ltv')} placeholder="70" />
            <Field label="Tenor (month)" id="tenor" type="number" value={form.tenor} onChange={set('tenor')} placeholder="1" />
            <Field label="Interest rate (% per tenor)" id="rate" type="number" value={form.rate} onChange={set('rate')} placeholder="3" step="0.1" />
            <Field label="FX Rate IDR/SGD" id="fx" type="text" value={form.fx} onChange={(v) => { const norm = v.replace(',', '.'); if (/^\d*\.?\d*$/.test(norm)) set('fx')(norm); }} placeholder="13739.27" />
          </Grid3>
        </div>

        <div style={{ marginBottom: 16 }}><SectionTitle>Date & Cost</SectionTitle>
          <Grid2>
            <Field label="Disbursement Date" id="disbDate" type="date" value={form.disbDate} onChange={set('disbDate')} />
            <Field label="Warehouse Fee (IDR)" id="whFee" type="number" value={form.whFee} onChange={set('whFee')} placeholder="81587500" />
            <Field label="Fidelity Insurance (IDR)" id="insFid" type="number" value={form.insFid} onChange={set('insFid')} placeholder="11532250" />
            <Field label="Admin fee (IDR) — income API" id="adminFee" type="number" value={form.adminFee} onChange={set('adminFee')} placeholder="1142225" />
            <Field label="PHJ fee (IDR)" id="phjFee" type="number" value={form.phjFee} onChange={set('phjFee')} placeholder="110000" />
          </Grid2>
        </div>

        {/* ── NEW: Settlement section ── */}
        <div style={{ marginBottom: 16 }}>
          <SectionTitle>Settlement</SectionTitle>
          <Grid2>
            <Select
              label="Status"
              id="status"
              value={form.status}
              onChange={set('status')}
              options={['Active', 'Repaid']}
            />
            <Field
              label="Repayment Date"
              id="repaymentDate"
              type="date"
              value={form.repaymentDate}
              onChange={set('repaymentDate')}
            />
          </Grid2>
          {isRepaid && (
            <div style={{
              background: '#f0fdf4', border: '1px solid #86efac', borderRadius: 8,
              padding: '10px 14px', fontSize: 12, color: '#166534', marginTop: 4,
            }}>
              ✓ This facility will be marked as <strong>Repaid</strong>. Days Remaining will be set to 0 and excluded from active portfolio totals.
            </div>
          )}
        </div>

        {preview && (
          <div style={{ background: 'var(--green-bg)', border: '1px solid rgba(30,124,58,0.2)', borderRadius: 10, padding: '12px 14px', fontSize: 12, color: 'var(--brand-dark)', marginBottom: 14, fontFamily: 'JetBrains Mono', lineHeight: 1.8 }}>
            <strong>Auto-calculated:</strong><br />
            Commodity value &nbsp;&nbsp;= IDR {fmt(preview.commVal)}<br />
            Loan principal &nbsp;&nbsp;&nbsp;= IDR {fmt(preview.principal)}<br />
            Interest income &nbsp;&nbsp;= IDR {fmt(preview.interest)}<br />
            Disbursed &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;= {fmtSGD(preview.disbSGD)}<br />
            Remaining facility &nbsp;&nbsp;&nbsp;&nbsp;= {fmtSGD(preview.headroom)}
          </div>
        )}

        <div style={{ display: 'flex', gap: 8 }}>
          <Btn primary onClick={handleSave}>{editing ? 'Update facility' : 'Add Facility'}</Btn>
          {editing && <Btn onClick={onCancel}>Cancel</Btn>}
        </div>
      </Card>

      <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--brand-dark)', marginBottom: 12 }}>
        Existing Facilities — click Edit to update
      </div>
      <div style={{ overflowX: 'auto', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', boxShadow: 'var(--shadow)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
          <thead>
            <tr>
              {['#','Borrower','Commodities','Tonnage','Principal (IDR)','SGD','Days','Status','Edit','Delete']
                .map(h => <th key={h} style={th}>{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 && (
              <tr><td colSpan={10} style={{ ...td, textAlign: 'center', padding: '1.5rem', color: 'var(--text-2)' }}>No facilities yet.</td></tr>
            )}
            {data.map((l, i) => {
              const repaid = l.status === 'Repaid';
              return (
                <tr key={l.id} style={{
                  background: repaid
                    ? '#f0fdf4'
                    : i % 2 === 0 ? 'var(--surface)' : 'var(--bg)',
                  opacity: repaid ? 0.75 : 1,
                }}>
                  <td style={td}>{i + 1}</td>
                  <td style={{ ...td, fontSize: 12 }}>{l.borrower.replace('PT ', '')}</td>
                  <td style={td}>{l.commodity}</td>
                  <td style={{ ...td, fontFamily: 'JetBrains Mono' }}>{Math.round(l.tonnage).toLocaleString()}</td>
                  <td style={{ ...td, fontFamily: 'JetBrains Mono', fontSize: 11 }}>{Math.round(l.principal).toLocaleString('id-ID')}</td>
                  <td style={{ ...td, fontFamily: 'JetBrains Mono', fontSize: 11 }}>{fmtSGD(l.disbSGD)}</td>
                  <td style={{ ...td, textAlign: 'center', fontWeight: 700 }}>{repaid ? '—' : (l.daysLeft ?? 0)}</td>
                  <td style={td}>
                    <span style={{
                      fontSize: 10, padding: '2px 8px', borderRadius: 20, fontWeight: 600,
                      background: repaid ? '#dcfce7' : '#d1fae5',
                      color: repaid ? '#166534' : '#065f46',
                    }}>
                      {repaid ? 'Repaid' : 'Active'}
                    </span>
                  </td>
                  <td style={td}><Btn small onClick={() => onEdit(l)}>Edit</Btn></td>
                  <td style={td}><Btn small danger onClick={() => onDelete(l.id)}>Delete</Btn></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
