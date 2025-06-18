import React from 'react';
import { PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Legend } from 'recharts';
import useTasksStore from '../hooks/useTasksStore';
import useSubjectsStore from '../hooks/useSubjectsStore';

const pastelColors = ['#F8C8DC', '#E6E6FA', '#BFEFFF', '#C6F6D5', '#FFFDD0', '#D6C1E6', '#FADADD', '#FFD1BA', '#E9D6EC'];
const categoryColors = {
  Study: '#BFEFFF',
  Revise: '#C6F6D5',
  Homework: '#FADADD',
  Other: '#FFFDD0',
};

function getStreak(tasks) {
  // Returns longest streak of days with at least one completed task
  const doneTasks = tasks.filter(t => t.done);
  const dates = [...new Set(doneTasks.map(t => t.date))].sort();
  let maxStreak = 0, curStreak = 0, prev = null;
  for (const d of dates) {
    if (!prev) { curStreak = 1; }
    else {
      const diff = (new Date(d) - new Date(prev)) / (1000 * 60 * 60 * 24);
      curStreak = diff === 1 ? curStreak + 1 : 1;
    }
    maxStreak = Math.max(maxStreak, curStreak);
    prev = d;
  }
  return maxStreak;
}

const Dashboard = () => {
  const { tasks } = useTasksStore();
  const { subjects } = useSubjectsStore();
  // Pie: time per subject (count of completed tasks per subject)
  const pieData = subjects.map((s, i) => ({
    name: s.name,
    value: tasks.filter(t => t.done && t.subjectId === s.id).length,
    fill: pastelColors[i % pastelColors.length],
  })).filter(d => d.value > 0);
  // Bar: tasks per category
  const barData = ['Study', 'Revise', 'Homework', 'Other'].map(cat => ({
    category: cat,
    count: tasks.filter(t => t.category === cat && t.done).length,
  }));
  // Streaks
  const streak = getStreak(tasks);
  // Milestones
  const totalDone = tasks.filter(t => t.done).length;
  const mastered = subjects.filter(s => tasks.filter(t => t.done && t.subjectId === s.id).length >= 10).length;

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-8 items-center">
      <h2 className="text-2xl font-quicksand text-babyblue mb-2">Progress Dashboard</h2>
      <div className="w-full flex flex-col md:flex-row gap-8">
        <div className="flex-1 bg-white/80 rounded-xl p-4 shadow border-2 border-lilac flex flex-col items-center">
          <h3 className="font-quicksand text-pink-400 mb-2">Time Spent per Subject</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} label>
                {pieData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex-1 bg-white/80 rounded-xl p-4 shadow border-2 border-lilac flex flex-col items-center">
          <h3 className="font-quicksand text-pink-400 mb-2">Tasks per Category</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={barData}>
              <XAxis dataKey="category" />
              <YAxis allowDecimals={false} />
              <Bar dataKey="count">
                {barData.map((entry, i) => <Cell key={i} fill={categoryColors[entry.category]} />)}
              </Bar>
              <Tooltip />
              <Legend />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="w-full flex flex-col md:flex-row gap-8 mt-4">
        <div className="flex-1 bg-mint/30 rounded-xl p-4 shadow flex flex-col items-center">
          <div className="font-quicksand text-lg text-mint">🔥 Streak</div>
          <div className="text-3xl font-quicksand text-mint">{streak} days</div>
        </div>
        <div className="flex-1 bg-pink-200/40 rounded-xl p-4 shadow flex flex-col items-center">
          <div className="font-quicksand text-lg text-pink-400">🏆 Milestones</div>
          <div className="text-lg font-quicksand text-pink-400">{totalDone} tasks completed</div>
          <div className="text-lg font-quicksand text-pink-400">{mastered} subjects mastered</div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 