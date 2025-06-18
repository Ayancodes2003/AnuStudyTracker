import { useEffect } from 'react';
import { db } from '../utils/firebase';
import { collection, onSnapshot, addDoc, doc, updateDoc, deleteDoc, query, where } from 'firebase/firestore';
import useSubjectsStore from './useSubjectsStore';

export default function useSubjectsFirestore(user) {
  const { set, getState } = useSubjectsStore;

  useEffect(() => {
    if (!user) return;
    const ref = collection(db, 'users', user.uid, 'subjects');
    const q = query(ref);
    const unsub = onSnapshot(q, (snap) => {
      set({ subjects: snap.docs.map(doc => ({ id: doc.id, ...doc.data() })) });
    });
    return () => unsub();
  }, [user, set]);

  // Firestore actions
  const addSubject = async (name, color) => {
    if (!user) return;
    const ref = collection(db, 'users', user.uid, 'subjects');
    await addDoc(ref, { name, color, notes: '', homework: [], revisionCount: 0 });
  };
  const editSubject = async (id, updates) => {
    if (!user) return;
    const ref = doc(db, 'users', user.uid, 'subjects', id);
    await updateDoc(ref, updates);
  };
  const deleteSubject = async (id) => {
    if (!user) return;
    const ref = doc(db, 'users', user.uid, 'subjects', id);
    await deleteDoc(ref);
  };
  const setNotes = (id, notes) => editSubject(id, { notes });
  const setHomework = (id, homework) => editSubject(id, { homework });
  const setRevisionCount = (id, revisionCount) => editSubject(id, { revisionCount });

  // Override Zustand store actions
  useEffect(() => {
    if (!user) return;
    set(state => ({
      ...state,
      addSubject,
      editSubject,
      deleteSubject,
      setNotes,
      setHomework,
      setRevisionCount,
    }));
  }, [user]);
} 