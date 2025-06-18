import { create } from 'zustand';

const useJournalStore = create((set) => ({
  entries: [],
  setEntry: (date, text) => set((state) => {
    const existing = state.entries.find(e => e.date === date);
    if (existing) {
      return { entries: state.entries.map(e => e.date === date ? { ...e, text } : e) };
    } else {
      return { entries: [...state.entries, { date, text, summary: '' }] };
    }
  }),
  setSummary: (date, summary) => set((state) => ({
    entries: state.entries.map(e => e.date === date ? { ...e, summary } : e)
  })),
  loadEntries: (entries) => set({ entries }),
}));

export default useJournalStore; 