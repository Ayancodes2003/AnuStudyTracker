import React, { useState, useEffect } from 'react';
import useSubjectsStore from '../../hooks/useSubjectsStore';

const pastelColors = [
  '#F8C8DC', // blush
  '#E6E6FA', // lavender
  '#BFEFFF', // baby blue
  '#C6F6D5', // mint
  '#FFFDD0', // cream
  '#D6C1E6', // pastel purple
  '#FADADD', // soft pink
  '#FFD1BA', // peach
  '#E9D6EC', // lilac
];

const SubjectModal = ({ open, onClose, editSubject }) => {
  const { addSubject, editSubject: editSubjectFn } = useSubjectsStore();
  const [name, setName] = useState('');
  const [color, setColor] = useState(pastelColors[0]);

  useEffect(() => {
    if (editSubject) {
      setName(editSubject.name);
      setColor(editSubject.color);
    } else {
      setName('');
      setColor(pastelColors[0]);
    }
  }, [editSubject, open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20">
      <div className="bg-white rounded-xl shadow-xl p-6 w-80 flex flex-col gap-4 border-2 border-lilac">
        <h3 className="text-lg font-quicksand text-pink-400 mb-2">
          {editSubject ? 'Edit Subject' : 'Add Subject'}
        </h3>
        <input
          className="rounded px-3 py-2 border border-lilac focus:outline-none focus:ring-2 focus:ring-pink-200 font-quicksand"
          placeholder="Subject name"
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <div className="flex gap-2 items-center">
          {pastelColors.map((c) => (
            <button
              key={c}
              className={`w-6 h-6 rounded-full border-2 ${color === c ? 'border-pink-400' : 'border-white'} transition-all`}
              style={{ background: c }}
              onClick={() => setColor(c)}
              aria-label={c}
            />
          ))}
        </div>
        <div className="flex gap-2 mt-2">
          <button
            className="flex-1 bg-mint text-green-700 rounded-lg py-2 font-quicksand hover:bg-green-200 transition-all"
            onClick={() => {
              if (!name.trim()) return;
              if (editSubject) {
                editSubjectFn(editSubject.id, { name, color });
              } else {
                addSubject(name, color);
              }
              onClose();
            }}
          >
            {editSubject ? 'Save' : 'Add'}
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

export default SubjectModal; 