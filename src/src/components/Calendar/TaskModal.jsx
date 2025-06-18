import React, { useState } from 'react';
import useTasksStore from '../../hooks/useTasksStore';

const categories = [
  { label: 'Study', color: 'bg-babyblue' },
  { label: 'Revise', color: 'bg-mint' },
  { label: 'Homework', color: 'bg-softpink' },
  { label: 'Other', color: 'bg-cream' },
];
const emojis = ['📚', '📝', '✅', '🌸', '💡', '🎀', '⭐', '🦄', '💖'];
const priorities = [
  { label: 'Low', value: 1 },
  { label: 'Medium', value: 2 },
  { label: 'High', value: 3 },
];

const TaskModal = ({ open, onClose, date }) => {
  const { addTask } = useTasksStore();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(categories[0].label);
  const [priority, setPriority] = useState(2);
  const [emoji, setEmoji] = useState(emojis[0]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20">
      <div className="bg-white rounded-xl shadow-xl p-6 w-80 flex flex-col gap-4 border-2 border-lilac">
        <h3 className="text-lg font-quicksand text-pink-400 mb-2">Add Task</h3>
        <input
          className="rounded px-3 py-2 border border-lilac focus:outline-none focus:ring-2 focus:ring-pink-200 font-quicksand"
          placeholder="Task title"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
        <div className="flex gap-2 items-center">
          {categories.map((c) => (
            <button
              key={c.label}
              className={`px-2 py-1 rounded font-quicksand text-xs ${category === c.label ? c.color + ' ring-2 ring-pink-300' : 'bg-lilac/20'} transition-all`}
              onClick={() => setCategory(c.label)}
            >
              {c.label}
            </button>
          ))}
        </div>
        <div className="flex gap-2 items-center">
          {emojis.map((e) => (
            <button
              key={e}
              className={`text-xl rounded-full ${emoji === e ? 'ring-2 ring-pink-300' : ''}`}
              onClick={() => setEmoji(e)}
            >
              {e}
            </button>
          ))}
        </div>
        <div className="flex gap-2 items-center">
          {priorities.map((p) => (
            <button
              key={p.value}
              className={`px-2 py-1 rounded font-quicksand text-xs ${priority === p.value ? 'bg-pink-200 text-pink-600' : 'bg-lilac/20'} transition-all`}
              onClick={() => setPriority(p.value)}
            >
              {p.label}
            </button>
          ))}
        </div>
        <div className="flex gap-2 mt-2">
          <button
            className="flex-1 bg-mint text-green-700 rounded-lg py-2 font-quicksand hover:bg-green-200 transition-all"
            onClick={() => {
              if (!title.trim()) return;
              addTask({ title, category, priority, emoji, date });
              onClose();
            }}
          >
            Add
          </button>
          <button
            className="flex-1 bg-softpink text-pink-500 rounded-lg py-2 font-quicksand hover:bg-pink-200 transition-all"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskModal; 