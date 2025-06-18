import { create } from 'zustand';
import { nanoid } from 'nanoid';

const useSubjectsStore = create((set) => ({
  subjects: [],
  addSubject: (name, color) => set((state) => ({
    subjects: [
      ...state.subjects,
      { id: nanoid(), name, color, notes: '', homework: [], revisionCount: 0 },
    ],
  })),
  editSubject: (id, updates) => set((state) => ({
    subjects: state.subjects.map((s) =>
      s.id === id ? { ...s, ...updates } : s
    ),
  })),
  deleteSubject: (id) => set((state) => ({
    subjects: state.subjects.filter((s) => s.id !== id),
  })),
  setNotes: (id, notes) => set((state) => ({
    subjects: state.subjects.map((s) =>
      s.id === id ? { ...s, notes } : s
    ),
  })),
  setHomework: (id, homework) => set((state) => ({
    subjects: state.subjects.map((s) =>
      s.id === id ? { ...s, homework } : s
    ),
  })),
  setRevisionCount: (id, revisionCount) => set((state) => ({
    subjects: state.subjects.map((s) =>
      s.id === id ? { ...s, revisionCount } : s
    ),
  })),
}));

export default useSubjectsStore; 