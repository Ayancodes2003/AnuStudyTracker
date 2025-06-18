import React, { useState } from 'react';
import { geminiRequest } from '../../utils/geminiApi';

const actions = [
  { type: 'summary', label: 'Summarize Notes' },
  { type: 'quiz', label: 'Mini Quiz' },
  { type: 'plan', label: 'Study Plan' },
  { type: 'affirmation', label: 'Motivational Quote' },
  { type: 'flashcards', label: 'Generate Flashcards' },
];

const AIModal = ({ open, onClose, subject }) => {
  const [selected, setSelected] = useState('summary');
  const [topics, setTopics] = useState('');
  const [book, setBook] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!open || !subject) return null;

  const handleRun = async () => {
    setLoading(true); setError(''); setResult('');
    try {
      const res = await geminiRequest({
        type: selected,
        notes: subject.notes,
        subject: subject.name,
        topics: selected === 'flashcards' ? topics : undefined,
        book: selected === 'flashcards' ? book : undefined,
      });
      setResult(res);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20">
      <div className="bg-white rounded-xl shadow-xl p-6 w-[95vw] max-w-lg flex flex-col gap-4 border-2 border-lilac">
        <h3 className="text-lg font-quicksand text-pink-400 mb-2">AI Assistant for {subject.name}</h3>
        <div className="flex gap-2 flex-wrap">
          {actions.map(a => (
            <button
              key={a.type}
              className={`px-2 py-1 rounded font-quicksand text-xs ${selected === a.type ? 'bg-pink-200 text-pink-600 ring-2 ring-pink-300' : 'bg-lilac/20'} transition-all`}
              onClick={() => setSelected(a.type)}
            >
              {a.label}
            </button>
          ))}
        </div>
        {selected === 'flashcards' && (
          <div className="flex flex-col gap-2">
            <input
              className="rounded px-3 py-2 border border-lilac font-quicksand"
              placeholder="Topics (comma separated, optional)"
              value={topics}
              onChange={e => setTopics(e.target.value)}
            />
            <input
              className="rounded px-3 py-2 border border-lilac font-quicksand"
              placeholder="Book/Source (optional)"
              value={book}
              onChange={e => setBook(e.target.value)}
            />
          </div>
        )}
        <button
          className="bg-mint text-green-700 rounded-lg py-2 font-quicksand hover:bg-green-200 transition-all"
          onClick={handleRun}
          disabled={loading}
        >
          {loading ? 'Thinking...' : 'Run AI'}
        </button>
        {error && <div className="text-xs text-red-400 text-center">{error}</div>}
        {result && (
          <div className="bg-lilac/10 rounded p-2 text-sm max-h-60 overflow-y-auto whitespace-pre-line font-quicksand">
            {result}
          </div>
        )}
        <button
          className="bg-softpink text-pink-500 rounded-lg py-2 font-quicksand hover:bg-pink-200 transition-all mt-2"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default AIModal; 