import { useState, useEffect, useCallback } from 'react';
import {
  getFirestore, collection, doc, onSnapshot,
  setDoc, deleteDoc, writeBatch, getDocs,
} from 'firebase/firestore';
import { DEFAULT_DATA } from '../data';
import { auth } from '../firebase';

const db = getFirestore();
const COL = 'srg-portfolio';

const recalcDays = (loan) => ({
  ...loan,
  daysLeft: loan.status === 'Repaid' ? 0 : loan.maturity
    ? Math.max(0, Math.round((new Date(loan.maturity) - new Date()) / 86400000))
    : 0,
});

export function usePortfolio() {
  const [data, setData] = useState([]);
  const [saveStatus, setSaveStatus] = useState('saved');
  const [loaded, setLoaded] = useState(false);

  // Listen to Firestore in real-time — all users see the same data
  useEffect(() => {
    const unsub = onSnapshot(collection(db, COL), (snap) => {
      if (snap.empty && !loaded) {
        // First time — seed with DEFAULT_DATA
        seedData();
        return;
      }
      const loans = snap.docs.map(d => recalcDays({ ...d.data(), id: d.id }));
      // Sort by original order (use serial or disbDate)
      loans.sort((a, b) => String(a.serial).localeCompare(String(b.serial)));
      setData(loans);
      setLoaded(true);
    }, (err) => {
      console.error('Firestore error:', err);
    });
    return () => unsub();
  }, []);

  const seedData = useCallback(async () => {
    try {
      const batch = writeBatch(db);
      DEFAULT_DATA.forEach(loan => {
        const ref = doc(db, COL, String(loan.id));
        batch.set(ref, { ...loan });
      });
      await batch.commit();
      setLoaded(true);
    } catch (e) {
      console.error('Seed error:', e);
    }
  }, []);

  const addLoan = useCallback(async (loan) => {
    setSaveStatus('saving');
    try {
      const id = String(Date.now());
      await setDoc(doc(db, COL, id), { ...loan, id });
    } catch (e) {
      console.error('Add error:', e);
    } finally {
      setSaveStatus('saved');
    }
  }, []);

  const updateLoan = useCallback(async (id, loan) => {
    setSaveStatus('saving');
    try {
      await setDoc(doc(db, COL, String(id)), { ...loan, id: String(id) });
    } catch (e) {
      console.error('Update error:', e);
    } finally {
      setSaveStatus('saved');
    }
  }, []);

  const deleteLoan = useCallback(async (id) => {
    setSaveStatus('saving');
    try {
      await deleteDoc(doc(db, COL, String(id)));
    } catch (e) {
      console.error('Delete error:', e);
    } finally {
      setSaveStatus('saved');
    }
  }, []);

  const resetData = useCallback(async () => {
    setSaveStatus('saving');
    try {
      // Delete all existing docs
      const snap = await getDocs(collection(db, COL));
      const batch = writeBatch(db);
      snap.docs.forEach(d => batch.delete(d.ref));
      await batch.commit();
      // Re-seed with DEFAULT_DATA
      const batch2 = writeBatch(db);
      DEFAULT_DATA.forEach(loan => {
        const ref = doc(db, COL, String(loan.id));
        batch2.set(ref, { ...loan });
      });
      await batch2.commit();
    } catch (e) {
      console.error('Reset error:', e);
    } finally {
      setSaveStatus('saved');
    }
  }, []);

  return { data, addLoan, updateLoan, deleteLoan, resetData, saveStatus };
}
