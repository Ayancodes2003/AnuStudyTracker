import React, { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import Journal from './pages/Journal';
import Dashboard from './pages/Dashboard';
import Sidebar from './components/Sidebar/Sidebar';
import useSubjectsStore from './hooks/useSubjectsStore';
import SubjectCard from './components/SubjectCard/SubjectCard';
import { useAuth } from './context/AuthContext';
import useSubjectsFirestore from './hooks/useSubjectsFirestore';
import useTasksFirestore from './hooks/useTasksFirestore';

function App() {
  const [selectedSubjectId, setSelectedSubjectId] = useState(null);
  const { subjects } = useSubjectsStore();
  const selectedSubject = subjects.find(s => s.id === selectedSubjectId);
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();

  useSubjectsFirestore(user);
  useTasksFirestore(user);

  if (loading) return null;
  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="flex min-h-screen bg-blush font-poppins">
      <aside className="w-64 bg-lavender p-4 hidden md:block shadow-lg">
        <div className="text-2xl font-quicksand text-pink-500 mb-6">Anu Study Tracker</div>
        <Sidebar onSelectSubject={setSelectedSubjectId} selectedSubjectId={selectedSubjectId} />
      </aside>
      <main className="flex-1 flex flex-col">
        <header className="p-4 bg-softpink shadow-sm text-center font-quicksand text-lg text-pink-600 flex justify-between items-center">
          <span>Welcome, {user.email.split('@')[0]}! 🌸</span>
          <button className="bg-pink-200 text-pink-600 rounded px-3 py-1 font-quicksand hover:bg-pink-300 text-sm" onClick={logout}>Logout</button>
        </header>
        <section className="flex-1 p-4">
          {selectedSubject ? (
            <SubjectCard subject={selectedSubject} />
          ) : (
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/journal" element={<Journal />} />
              <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
