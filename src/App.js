import React, { useState, useEffect } from 'react';
import './index.css';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, isEditor } from './firebase';
import { usePortfolio } from './hooks/usePortfolio';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Overview from './components/Overview';
import Portfolio from './components/Portfolio';
import Facility from './components/Facility';
import Maturity from './components/Maturity';
import AddEdit from './components/AddEdit';
import Login from './components/Login';
import { PageHeader, Btn } from './components/UI';

const TITLES = {
  overview:  { title: 'Overview', sub: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) },
  portfolio: { title: 'Portfolio detail', sub: 'All active SRG facilities' },
  facility:  { title: 'Facility utilization', sub: 'SGD 1,510,000 total facility' },
  maturity:  { title: 'Maturity schedule', sub: 'Repayment schedule — sorted soonest first' },
  add:       { title: 'Add / Edit', sub: 'Add or modify SRG facilities' },
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
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const { data, addLoan, updateLoan, deleteLoan, resetData, saveStatus } = usePortfolio();
  const [tab, setTab] = useState('overview');
  const [editing, setEditing] = useState(null);
  const [notify, setNotify] = useState('');

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setAuthLoading(false);
    });
    return unsub;
  }, []);

  const showNotify = (msg) => { setNotify(msg); setTimeout(() => setNotify(''), 2500); };
  const editor = isEditor(user?.email);

  const handleAdd = () => { setEditing(null); setTab('add'); };
  const handleEdit = (loan) => { setEditing(loan); setTab('add'); };
  const handleDelete = (id) => {
    if (!editor) return;
    if (!window.confirm('Delete this facility?')) return;
    deleteLoan(id); showNotify('Facility deleted.');
  };
  const handleSave = (loan) => {
    if (!editor) return;
    if (editing) { updateLoan(editing.id, loan); showNotify('Facility updated.'); }
    else { addLoan(loan); showNotify('New facility added.'); }
    setEditing(null);
  };
  const handleReset = () => {
    if (!editor) return;
    if (!window.confirm('Reset to original 8 facilities?')) return;
    resetData(); showNotify('Data reset to default.');
  };

  // Loading state
  if (authLoading) {
    return (
      <div style={{ minHeight: '100vh', background: '#0d3d1c', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: '#a8d4b3', fontSize: 14 }}>Loading…</div>
      </div>
    );
  }

  // Not logged in
  if (!user) return <Login />;

  const { title, sub } = TITLES[tab];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      <Header
        saveStatus={saveStatus}
        onAdd={handleAdd}
        onReset={handleReset}
        onExport={() => exportCSV(data)}
        user={user}
      />
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <Sidebar active={tab} onChange={(t) => { setTab(t); if (t !== 'add') setEditing(null); }} editor={editor} />
        <main style={{ flex: 1, overflowY: 'auto', padding: 24, background: 'var(--bg)' }}>
          <PageHeader title={title} sub={sub}>
            {tab === 'portfolio' && editor && <Btn small primary onClick={handleAdd}>＋ Add</Btn>}
          </PageHeader>

          {tab === 'overview'  && <Overview data={data} />}
          {tab === 'portfolio' && <Portfolio data={data} onEdit={editor ? handleEdit : null} onDelete={editor ? handleDelete : null} editor={editor} />}
          {tab === 'facility'  && <Facility data={data} />}
          {tab === 'maturity'  && <Maturity data={data} />}
          {tab === 'add' && editor && (
            <AddEdit data={data} editing={editing} onSave={handleSave}
              onCancel={() => setEditing(null)} onEdit={handleEdit} onDelete={handleDelete} />
          )}
          {tab === 'add' && !editor && (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-2)' }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>🔒</div>
              <div style={{ fontSize: 15, fontWeight: 600 }}>View only access</div>
              <div style={{ fontSize: 13, marginTop: 6 }}>You do not have permission to add or edit facilities.</div>
            </div>
          )}
        </main>
      </div>

      {notify && (
        <div style={{
          position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)',
          background: 'var(--brand-darker)', color: '#fff', padding: '10px 20px',
          borderRadius: 20, fontSize: 13, fontWeight: 500, zIndex: 999,
          boxShadow: '0 4px 20px rgba(0,0,0,0.25)', animation: 'fadeIn 0.2s ease',
        }}>
          {notify}
        </div>
      )}
      <style>{`@keyframes fadeIn { from { opacity:0; transform:translateX(-50%) translateY(8px); } to { opacity:1; transform:translateX(-50%) translateY(0); } }`}</style>
    </div>
  );
}
