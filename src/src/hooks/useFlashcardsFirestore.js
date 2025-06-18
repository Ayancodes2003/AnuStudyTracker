import { useEffect } from 'react';
import { db } from '../utils/firebase';
import { collection, onSnapshot, setDoc, doc, query } from 'firebase/firestore';
import useFlashcardsStore from './useFlashcardsStore';

export default function useFlashcardsFirestore(user) {
  const { setFlashcards, markKnown, markUnknown, loadFlashcards } = useFlashcardsStore.getState();

  useEffect(() => {
    if (!user) return;
    const ref = collection(db, 'users', user.uid, 'flashcards');
    const q = query(ref);
    const unsub = onSnapshot(q, (snap) => {
      loadFlashcards(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsub();
  }, [user, loadFlashcards]);

  // Firestore actions
  const saveFlashcards = async (subjectId, cards) => {
    if (!user) return;
    for (let i = 0; i < cards.length; i++) {
      const ref = doc(db, 'users', user.uid, 'flashcards', `${subjectId}-${i}`);
      await setDoc(ref, { ...cards[i], subjectId }, { merge: true });
    }
    setFlashcards(subjectId, cards);
  };
  const saveKnown = async (id, known) => {
    if (!user) return;
    const ref = doc(db, 'users', user.uid, 'flashcards', id);
    await setDoc(ref, { known }, { merge: true });
    if (known) markKnown(id); else markUnknown(id);
  };

  // Override Zustand store actions
  useEffect(() => {
    if (!user) return;
    useFlashcardsStore.setState({
      setFlashcards: saveFlashcards,
      markKnown: (id) => saveKnown(id, true),
      markUnknown: (id) => saveKnown(id, false),
    });
  }, [user]);
} 