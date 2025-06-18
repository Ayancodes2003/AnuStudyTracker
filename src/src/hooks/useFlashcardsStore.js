import { create } from 'zustand';

const useFlashcardsStore = create((set) => ({
  flashcards: [],
  setFlashcards: (subjectId, cards) => set((state) => ({
    flashcards: [
      ...state.flashcards.filter(f => f.subjectId !== subjectId),
      ...cards.map((c, i) => ({ id: `${subjectId}-${i}`, subjectId, ...c, known: false })),
    ],
  })),
  markKnown: (id) => set((state) => ({
    flashcards: state.flashcards.map(f => f.id === id ? { ...f, known: true } : f),
  })),
  markUnknown: (id) => set((state) => ({
    flashcards: state.flashcards.map(f => f.id === id ? { ...f, known: false } : f),
  })),
  loadFlashcards: (cards) => set({ flashcards: cards }),
}));

export default useFlashcardsStore; 