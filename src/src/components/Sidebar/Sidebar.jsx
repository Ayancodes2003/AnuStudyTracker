import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { FaBook, FaRegCalendarAlt, FaChartPie, FaHeart, FaTrash, FaEdit } from 'react-icons/fa';
import useSubjectsStore from '../../hooks/useSubjectsStore';
import SubjectModal from './SubjectModal';

const Sidebar = ({ onSelectSubject, selectedSubjectId }) => {
  const { subjects, deleteSubject } = useSubjectsStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [editSubject, setEditSubject] = useState(null);

  return (
    <nav className="flex flex-col gap-4">
      <NavLink to="/" className={({ isActive }) => `flex items-center gap-2 px-3 py-2 rounded-lg font-quicksand transition-all hover:bg-softpink hover:text-pink-600 ${isActive ? 'bg-softpink text-pink-600' : 'text-pink-400'}` } end>
        <FaRegCalendarAlt className="text-lg" />
        Home
      </NavLink>
      <NavLink to="/dashboard" className={({ isActive }) => `flex items-center gap-2 px-3 py-2 rounded-lg font-quicksand transition-all hover:bg-babyblue hover:text-blue-600 ${isActive ? 'bg-babyblue text-blue-600' : 'text-babyblue'}` }>
        <FaChartPie className="text-lg" />
        Dashboard
      </NavLink>
      <NavLink to="/journal" className={({ isActive }) => `flex items-center gap-2 px-3 py-2 rounded-lg font-quicksand transition-all hover:bg-mint hover:text-green-600 ${isActive ? 'bg-mint text-green-600' : 'text-mint'}` }>
        <FaHeart className="text-lg" />
        Journal
      </NavLink>
      <div className="my-6 border-t border-lilac/40" />
      <div className="flex items-center justify-between mb-2">
        <span className="font-quicksand text-pink-400 text-sm">Subjects</span>
        <button className="bg-softpink text-pink-500 rounded-full w-6 h-6 flex items-center justify-center shadow hover:bg-pink-200 transition-all" title="Add Subject" onClick={() => { setEditSubject(null); setModalOpen(true); }}>
          +
        </button>
      </div>
      <ul className="flex flex-col gap-2 text-xs text-lilac">
        {subjects.length === 0 && <li className="italic opacity-60">No subjects yet</li>}
        {subjects.map((subject) => (
          <li key={subject.id} className={`flex items-center justify-between bg-white/60 rounded px-2 py-1 cursor-pointer transition-all ${selectedSubjectId === subject.id ? 'ring-2 ring-pink-300' : ''}`}
            onClick={() => onSelectSubject && onSelectSubject(subject.id)}
          >
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full inline-block" style={{ background: subject.color || '#F8C8DC' }}></span>
              <span className="font-quicksand text-pink-500">{subject.name}</span>
            </span>
            <span className="flex gap-1">
              <button className="hover:text-mint" title="Edit" onClick={e => { e.stopPropagation(); setEditSubject(subject); setModalOpen(true); }}><FaEdit /></button>
              <button className="hover:text-red-400" title="Delete" onClick={e => { e.stopPropagation(); deleteSubject(subject.id); }}><FaTrash /></button>
            </span>
          </li>
        ))}
      </ul>
      <SubjectModal open={modalOpen} onClose={() => setModalOpen(false)} editSubject={editSubject} />
      <div className="mt-8 text-xs text-lilac">Made with <span className="text-pink-400">♥</span> for Anu</div>
    </nav>
  );
};

export default Sidebar; 