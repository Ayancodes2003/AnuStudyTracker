import React, { useState } from 'react';
import useTasksStore from '../../hooks/useTasksStore';
import TaskModal from './TaskModal';

const getMonthDays = (year, month) => {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const days = [];
  for (let i = 1; i <= lastDay.getDate(); i++) {
    days.push(new Date(year, month, i));
  }
  return days;
};

const categoryColors = {
  Study: 'bg-babyblue text-blue-700',
  Revise: 'bg-mint text-green-700',
  Homework: 'bg-softpink text-pink-500',
  Other: 'bg-cream text-yellow-700',
};

const Calendar = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const days = getMonthDays(year, month);
  const firstDayOfWeek = new Date(year, month, 1).getDay();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const { tasksByDate, toggleTaskDone } = useTasksStore();

  const handleAddTask = (date) => {
    setSelectedDate(date);
    setModalOpen(true);
  };

  const getDateString = (date) => date.toISOString().slice(0, 10);

  return (
    <div className="w-full max-w-4xl mx-auto relative">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-quicksand text-pink-400">
          {today.toLocaleString('default', { month: 'long' })} {year}
        </h2>
      </div>
      <div className="grid grid-cols-7 gap-2">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div key={d} className="text-center font-quicksand text-lilac mb-1">{d}</div>
        ))}
        {Array(firstDayOfWeek).fill(null).map((_, i) => (
          <div key={i} />
        ))}
        {days.map((date) => {
          const dateStr = getDateString(date);
          const tasks = tasksByDate(dateStr);
          return (
            <div
              key={date.toISOString()}
              className="rounded-xl bg-white/80 border-2 border-lilac p-2 min-h-[90px] flex flex-col items-center justify-between shadow hover:shadow-lg transition-all cursor-pointer relative group"
              onClick={() => handleAddTask(dateStr)}
            >
              <div className="font-quicksand text-pink-400 text-lg">{date.getDate()}</div>
              <div className="flex flex-col gap-1 mt-2 w-full">
                {tasks.length === 0 && <span className="text-xs text-lilac italic">No tasks</span>}
                {tasks.map((task) => (
                  <div key={task.id} className={`flex items-center gap-1 px-1 py-0.5 rounded text-xs ${categoryColors[task.category] || 'bg-lilac/20'}`}
                    onClick={e => e.stopPropagation()}
                  >
                    <input type="checkbox" checked={task.done} onChange={() => toggleTaskDone(task.id)} className="accent-pink-400" />
                    <span>{task.emoji}</span>
                    <span className={task.done ? 'line-through opacity-60' : ''}>{task.title}</span>
                  </div>
                ))}
              </div>
              <button
                className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition bg-pink-200 text-pink-600 rounded-full w-6 h-6 flex items-center justify-center shadow hover:bg-pink-300"
                onClick={e => { e.stopPropagation(); handleAddTask(dateStr); }}
                title="Add Task"
              >
                +
              </button>
            </div>
          );
        })}
      </div>
      <TaskModal open={modalOpen} onClose={() => setModalOpen(false)} date={selectedDate} />
      <button
        className="fixed bottom-8 right-8 bg-pink-400 text-white rounded-full w-14 h-14 flex items-center justify-center text-3xl shadow-lg hover:bg-pink-500 transition-all z-50"
        onClick={() => { setSelectedDate(getDateString(today)); setModalOpen(true); }}
        title="Add Task"
      >
        +
      </button>
    </div>
  );
};

export default Calendar; 