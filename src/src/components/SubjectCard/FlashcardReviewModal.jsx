import React, { useState } from 'react';
import useFlashcardsStore from '../../hooks/useFlashcardsStore';

const FlashcardReviewModal = ({ open, onClose, subjectId }) => {
  const { flashcards, markKnown, markUnknown } = useFlashcardsStore();
  const cards = flashcards.filter(f => f.subjectId === subjectId);
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  if (!open) return null;
  if (cards.length === 0) return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20">
      <div className="bg-white rounded-xl shadow-xl p-6 w-[95vw] max-w-md flex flex-col gap-4 border-2 border-lilac items-center">
        <div className="text-lg font-quicksand text-pink-400">No flashcards for this subject yet.</div>
        <button className="bg-softpink text-pink-500 rounded-lg py-2 px-4 font-quicksand hover:bg-pink-200 transition-all mt-2" onClick={onClose}>Close</button>
      </div>
    </div>
  );
  const card = cards[idx];
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20">
      <div className="bg-white rounded-xl shadow-xl p-6 w-[95vw] max-w-md flex flex-col gap-4 border-2 border-lilac items-center">
        <div className="font-quicksand text-pink-400 mb-2">Flashcard {idx + 1} of {cards.length}</div>
        <div className={`w-full h-40 flex items-center justify-center rounded-xl shadow bg-lilac/10 cursor-pointer font-quicksand text-lg text-center transition-all ${flipped ? 'rotate-y-180' : ''}`}
          style={{ perspective: 1000 }}
          onClick={() => setFlipped(f => !f)}
        >
          {!flipped ? card.question : <span className="text-mint">{card.answer}</span>}
        </div>
        <div className="flex gap-2 mt-2">
          <button className="bg-mint text-green-700 rounded-lg py-2 px-4 font-quicksand hover:bg-green-200 transition-all" onClick={() => { markKnown(card.id); setIdx((i) => (i + 1) % cards.length); setFlipped(false); }}>Known</button>
          <button className="bg-pink-200 text-pink-600 rounded-lg py-2 px-4 font-quicksand hover:bg-pink-300 transition-all" onClick={() => { markUnknown(card.id); setIdx((i) => (i + 1) % cards.length); setFlipped(false); }}>Review Again</button>
        </div>
        <button className="bg-softpink text-pink-500 rounded-lg py-2 px-4 font-quicksand hover:bg-pink-200 transition-all mt-2" onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default FlashcardReviewModal; 