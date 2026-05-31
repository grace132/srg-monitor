import { useState, useEffect } from 'react';
import { DEFAULT_DATA } from '../data';

const STORAGE_KEY = 'srg-monitor-v3';

export function usePortfolio() {
  const [data, setData] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return DEFAULT_DATA.map(l => ({ ...l }));
  });

  const [saveStatus, setSaveStatus] = useState('saved'); // 'saved' | 'saving'

  useEffect(() => {
    setSaveStatus('saving');
    const t = setTimeout(() => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      setSaveStatus('saved');
    }, 400);
    return () => clearTimeout(t);
  }, [data]);

  // Recalc daysLeft on load
  useEffect(() => {
    setData(prev => prev.map(l => ({
      ...l,
      daysLeft: l.maturity
        ? Math.max(0, Math.round((new Date(l.maturity) - new Date()) / 86400000))
        : 0,
    })));
  }, []);

  const addLoan = (loan) => setData(prev => [...prev, { ...loan, id: Date.now() }]);

  const updateLoan = (id, loan) =>
    setData(prev => prev.map(l => (l.id === id ? { ...loan, id } : l)));

  const deleteLoan = (id) => setData(prev => prev.filter(l => l.id !== id));

  const resetData = () => setData(DEFAULT_DATA.map(l => ({ ...l })));

  return { data, addLoan, updateLoan, deleteLoan, resetData, saveStatus };
}
