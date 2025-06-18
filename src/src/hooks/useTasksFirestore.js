import { useEffect } from 'react';
import { db } from '../utils/firebase';
import { collection, onSnapshot, addDoc, doc, updateDoc, deleteDoc, query } from 'firebase/firestore';
import useTasksStore from './useTasksStore';

export default function useTasksFirestore(user) {
  const { set } = useTasksStore;

  useEffect(() => {
    if (!user) return;
    const ref = collection(db, 'users', user.uid, 'tasks');
    const q = query(ref);
    const unsub = onSnapshot(q, (snap) => {
      set({ tasks: snap.docs.map(doc => ({ id: doc.id, ...doc.data() })) });
    });
    return () => unsub();
  }, [user, set]);

  // Firestore actions
  const addTask = async (task) => {
    if (!user) return;
    const ref = collection(db, 'users', user.uid, 'tasks');
    await addDoc(ref, task);
  };
  const editTask = async (id, updates) => {
    if (!user) return;
    const ref = doc(db, 'users', user.uid, 'tasks', id);
    await updateDoc(ref, updates);
  };
  const deleteTask = async (id) => {
    if (!user) return;
    const ref = doc(db, 'users', user.uid, 'tasks', id);
    await deleteDoc(ref);
  };
  const toggleTaskDone = (id) => {
    const task = useTasksStore.getState().tasks.find(t => t.id === id);
    if (task) editTask(id, { done: !task.done });
  };

  // Override Zustand store actions
  useEffect(() => {
    if (!user) return;
    set(state => ({
      ...state,
      addTask,
      editTask,
      deleteTask,
      toggleTaskDone,
    }));
  }, [user]);
} 