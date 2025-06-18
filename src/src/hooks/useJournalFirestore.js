import { useEffect } from 'react';
import { db } from '../utils/firebase';
import { collection, onSnapshot, setDoc, doc, query } from 'firebase/firestore';
import useJournalStore from './useJournalStore';

export default function useJournalFirestore(user) {
  const { setEntry, setSummary, loadEntries } = useJournalStore.getState();

  useEffect(() => {
    if (!user) return;
    const ref = collection(db, 'users', user.uid, 'journal');
    const q = query(ref);
    const unsub = onSnapshot(q, (snap) => {
      loadEntries(snap.docs.map(doc => ({ date: doc.id, ...doc.data() })));
    });
    return () => unsub();
  }, [user, loadEntries]);

  // Firestore actions
  const saveEntry = async (date, text) => {
    if (!user) return;
    const ref = doc(db, 'users', user.uid, 'journal', date);
    await setDoc(ref, { text }, { merge: true });
    setEntry(date, text);
  };
  const saveSummary = async (date, summary) => {
    if (!user) return;
    const ref = doc(db, 'users', user.uid, 'journal', date);
    await setDoc(ref, { summary }, { merge: true });
    setSummary(date, summary);
  };

  // Override Zustand store actions
  useEffect(() => {
    if (!user) return;
    useJournalStore.setState({
      setEntry: saveEntry,
      setSummary: saveSummary,
    });
  }, [user]);
} 