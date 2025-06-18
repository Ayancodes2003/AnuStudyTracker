import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import useJournalStore from '../hooks/useJournalStore';
import useJournalFirestore from '../hooks/useJournalFirestore';
import { geminiRequest } from '../utils/geminiApi';

const getToday = () => new Date().toISOString().slice(0, 10);

const Journal = () => {
  const { user } = useAuth();
  useJournalFirestore(user);
  const { entries, setEntry, setSummary } = useJournalStore();
  const today = getToday();
  const todayEntry = entries.find(e => e.date === today) || { text: '', summary: '' };
  const [text, setText] = useState(todayEntry.text);
  const [loading, setLoading] = useState(false);
  const [sumLoading, setSumLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async () => {
    setLoading(true); setError('');
    try {
      await setEntry(today, text);
    } catch (err) {
      setError('Failed to save');
    } finally {
      setLoading(false);
    }
  };

  const handleSummary = async () => {
    setSumLoading(true); setError('');
    try {
      const summary = await geminiRequest({ type: 'summary', notes: text, subject: 'Journal Reflection' });
      await setSummary(today, summary);
    } catch (err) {
      setError('Failed to summarize');
    } finally {
      setSumLoading(false);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col gap-6 items-center">
      <h2 className="text-2xl font-quicksand text-mint mb-2">Today's Reflection</h2>
      <textarea
        className="w-full rounded border border-lilac p-2 font-quicksand min-h-[100px]"
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Write your thoughts, feelings, or what you learned today..."
      />
      <div className="flex gap-2">
        <button className="bg-mint text-green-700 rounded-lg py-2 px-4 font-quicksand hover:bg-green-200 transition-all" onClick={handleSave} disabled={loading}>
          {loading ? 'Saving...' : 'Save'}
        </button>
        <button className="bg-pink-200 text-pink-600 rounded-lg py-2 px-4 font-quicksand hover:bg-pink-300 transition-all" onClick={handleSummary} disabled={sumLoading}>
          {sumLoading ? 'Summarizing...' : 'Gemini Summary'}
        </button>
      </div>
      {error && <div className="text-xs text-red-400 text-center">{error}</div>}
      {todayEntry.summary && (
        <div className="bg-lilac/10 rounded p-2 text-sm w-full font-quicksand">
          <b>Gemini Summary:</b> {todayEntry.summary}
        </div>
      )}
      <div className="w-full mt-8">
        <h3 className="font-quicksand text-lilac mb-2">Previous Reflections</h3>
        <ul className="flex flex-col gap-2">
          {entries.filter(e => e.date !== today).sort((a, b) => b.date.localeCompare(a.date)).map(e => (
            <li key={e.date} className="bg-white/60 rounded p-2 text-xs text-lilac">
              <b>{e.date}:</b> {e.text.slice(0, 80)}{e.text.length > 80 ? '...' : ''}
              {e.summary && <div className="mt-1 text-pink-400">Gemini: {e.summary.slice(0, 60)}{e.summary.length > 60 ? '...' : ''}</div>}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Journal; 