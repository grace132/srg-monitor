import React, { useState } from 'react';
import './index.css';
import { usePortfolio } from './hooks/usePortfolio';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Overview from './components/Overview';
import Portfolio from './components/Portfolio';
import Facility from './components/Facility';
import Maturity from './components/Maturity';
import AddEdit from './components/AddEdit';
import { PageHeader, Btn } from './components/UI';

const TITLES = {
  overview:  { title: 'Overview',            sub: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) },
  portfolio: { title: 'Portfolio detail',    sub: 'All active SRG facilities' },
  facility:  { title: 'Facility utilization', sub: 'SGD 1,510,000 total facility' },
  maturity:  { title: 'Maturity schedule',   sub: 'Repayment schedule — sorted soonest first' },
  add:       { title: 'Add / Edit',          sub: 'Add or modify SRG facilities' },
};

function exportCSV(data) {
  const headers = ['No','SRG','Serial','Borrower','Commodity','Warehouse','Tonnage','Price/kg','Comm Value','LTV%','Tenor','Principal','Interest','Disbursed SGD','Admin Fee','WH Fee','Ins Fid','PHJ Fee','Disb Date','Maturity','Days Left','PHJ No','Grade','Status'];
  const rows = data.map((l, i) => [
    i + 1, l.srg, l.serial, l.borrower, l.commodity, l.warehouse, l.tonnage, l.priceKg,
    l.tonnage * l.priceKg, l.ltv, l.tenor, l.principal, l.interest, l.disbSGD.toFixed(2),
    l.adminFee, l.whFee, l.insFid, l.phjFee, l.disbDate, l.maturity, l.daysLeft ?? 0,
    l.phj, l.grade, l.status,
  ]);
  const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
  const a = document.createElement('a');
  a.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
  a.download = 'SRG_Portfolio_' + new Date().toISOString().split('T')[0] + '.csv';
  a.click();
}

export default function App() {
  const { data, addLoan, updateLoan, deleteLoan, resetData, saveStatus } = usePortfolio();
  const [tab, setTab] = useState('overview');
  const [editing, setEditing] = useState(null);
  const [notify, setNotify] = useState('');

  const showNotify = (msg) => {
    setNotify(msg);
    setTimeout(() => setNotify(''), 2500);
  };

  const handleAdd = () => { setEditing(null); setTab('add'); };

  const handleEdit = (loan) => { setEditing(loan); setTab('add'); };

  const handleDelete = (id) => {
    if (!window.confirm('Delete this facility?')) return;
    deleteLoan(id);
    showNotify('Facility deleted.');
  };

  const handleSave = (loan) => {
    if (editing) {
      updateLoan(editing.id, loan);
      showNotify('Facility updated. All totals recalculated.');
    } else {
      addLoan(loan);
      showNotify('New facility added.');
    }
    setEditing(null);
  };

  const handleReset = () => {
    if (!window.confirm('Reset to original 8 facilities?')) return;
    resetData();
    showNotify('Data reset to default.');
  };

  const { title, sub } = TITLES[tab];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      <Header
        saveStatus={saveStatus}
        onAdd={handleAdd}
        onReset={handleReset}
        onExport={() => exportCSV(data)}
      />
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <Sidebar active={tab} onChange={(t) => { setTab(t); if (t !== 'add') setEditing(null); }} />
        <main style={{ flex: 1, overflowY: 'auto', padding: 24, background: 'var(--bg)' }}>
          <PageHeader title={title} sub={sub}>
            {tab === 'portfolio' && <Btn small primary onClick={handleAdd}>＋ Add</Btn>}
          </PageHeader>

          {tab === 'overview'  && <Overview  data={data} />}
          {tab === 'portfolio' && <Portfolio data={data} onEdit={handleEdit} onDelete={handleDelete} />}
          {tab === 'facility'  && <Facility  data={data} />}
          {tab === 'maturity'  && <Maturity  data={data} />}
          {tab === 'add'       && (
            <AddEdit
              data={data}
              editing={editing}
              onSave={handleSave}
              onCancel={() => setEditing(null)}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}
        </main>
      </div>

      {/* Notify toast */}
      {notify && (
        <div style={{
          position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)',
          background: 'var(--brand-darker)', color: '#fff', padding: '10px 20px',
          borderRadius: 20, fontSize: 13, fontWeight: 500, zIndex: 999,
          boxShadow: '0 4px 20px rgba(0,0,0,0.25)',
          animation: 'fadeIn 0.2s ease',
        }}>
          {notify}
        </div>
      )}

      <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateX(-50%) translateY(8px); } to { opacity: 1; transform: translateX(-50%) translateY(0); } }`}</style>
    </div>
  );
}
