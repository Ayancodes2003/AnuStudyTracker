import React, { useState } from 'react';
import useSubjectsStore from '../../hooks/useSubjectsStore';
import ReactMarkdown from 'react-markdown';
import AIModal from './AIModal';
import FlashcardReviewModal from './FlashcardReviewModal';

const SubjectCard = ({ subject }) => {
  const { setNotes, setHomework, setRevisionCount } = useSubjectsStore();
  const [notes, setNotesLocal] = useState(subject.notes || '');
  const [homeworkInput, setHomeworkInput] = useState('');
  const [aiOpen, setAIOpen] = useState(false);
  const [reviewOpen, setReviewOpen] = useState(false);

  const handleAddHomework = () => {
    if (!homeworkInput.trim()) return;
    setHomework(subject.id, [...(subject.homework || []), { text: homeworkInput, done: false }]);
    setHomeworkInput('');
  };

  const handleToggleHomework = (idx) => {
    const updated = subject.homework.map((hw, i) => i === idx ? { ...hw, done: !hw.done } : hw);
    setHomework(subject.id, updated);
  };

  const handleDeleteHomework = (idx) => {
    const updated = subject.homework.filter((_, i) => i !== idx);
    setHomework(subject.id, updated);
  };

  return (
    <div className="bg-white/80 rounded-xl shadow-lg p-6 w-full max-w-xl flex flex-col gap-6 border-2 border-lilac">
      <div className="flex items-center gap-2 mb-2">
        <span className="w-4 h-4 rounded-full" style={{ background: subject.color }}></span>
        <span className="font-quicksand text-xl text-pink-500">{subject.name}</span>
      </div>
      {/* Notes */}
      <div>
        <div className="font-quicksand text-pink-400 mb-1">Notes (Markdown supported)</div>
        <textarea
          className="w-full rounded border border-lilac p-2 font-quicksand mb-2 min-h-[80px]"
          value={notes}
          onChange={e => {
            setNotesLocal(e.target.value);
            setNotes(subject.id, e.target.value);
          }}
          placeholder="Write your notes here..."
        />
        <div className="bg-lilac/10 rounded p-2 text-sm">
          <ReactMarkdown>{notes}</ReactMarkdown>
        </div>
      </div>
      {/* Homework */}
      <div>
        <div className="font-quicksand text-pink-400 mb-1">Homework Checklist</div>
        <div className="flex gap-2 mb-2">
          <input
            className="flex-1 rounded border border-lilac p-2 font-quicksand"
            value={homeworkInput}
            onChange={e => setHomeworkInput(e.target.value)}
            placeholder="Add homework..."
            onKeyDown={e => { if (e.key === 'Enter') handleAddHomework(); }}
          />
          <button className="bg-mint text-green-700 rounded px-3 py-1 font-quicksand hover:bg-green-200" onClick={handleAddHomework}>Add</button>
        </div>
        <ul className="flex flex-col gap-1">
          {(subject.homework || []).length === 0 && <li className="italic text-lilac">No homework yet</li>}
          {subject.homework && subject.homework.map((hw, idx) => (
            <li key={idx} className="flex items-center gap-2">
              <input type="checkbox" checked={hw.done} onChange={() => handleToggleHomework(idx)} />
              <span className={hw.done ? 'line-through text-lilac' : ''}>{hw.text}</span>
              <button className="text-xs text-red-400 hover:underline ml-2" onClick={() => handleDeleteHomework(idx)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
      {/* Revision Tracker */}
      <div>
        <div className="font-quicksand text-pink-400 mb-1">Revision Tracker</div>
        <div className="flex items-center gap-2">
          <button className="bg-softpink text-pink-500 rounded px-2 py-1 font-quicksand hover:bg-pink-200" onClick={() => setRevisionCount(subject.id, Math.max(0, (subject.revisionCount || 0) - 1))}>-</button>
          <span className="font-quicksand text-lg">{subject.revisionCount || 0} repetitions</span>
          <button className="bg-mint text-green-700 rounded px-2 py-1 font-quicksand hover:bg-green-200" onClick={() => setRevisionCount(subject.id, (subject.revisionCount || 0) + 1)}>+</button>
        </div>
      </div>
      <div className="flex gap-2 self-end">
        <button className="bg-pink-200 text-pink-600 rounded px-3 py-1 font-quicksand hover:bg-pink-300 transition-all" onClick={() => setAIOpen(true)}>
          ✨ AI
        </button>
        <button className="bg-mint text-green-700 rounded px-3 py-1 font-quicksand hover:bg-green-200 transition-all" onClick={() => setReviewOpen(true)}>
          🃏 Review Flashcards
        </button>
      </div>
      <AIModal open={aiOpen} onClose={() => setAIOpen(false)} subject={subject} />
      <FlashcardReviewModal open={reviewOpen} onClose={() => setReviewOpen(false)} subjectId={subject.id} />
    </div>
  );
};

export default SubjectCard; 