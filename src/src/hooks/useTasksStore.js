import { create } from 'zustand';
import { nanoid } from 'nanoid';

const useTasksStore = create((set, get) => ({
  tasks: [],
  addTask: (task) => set((state) => ({
    tasks: [...state.tasks, { ...task, id: nanoid(), done: false }],
  })),
  editTask: (id, updates) => set((state) => ({
    tasks: state.tasks.map((t) => (t.id === id ? { ...t, ...updates } : t)),
  })),
  deleteTask: (id) => set((state) => ({
    tasks: state.tasks.filter((t) => t.id !== id),
  })),
  toggleTaskDone: (id) => set((state) => ({
    tasks: state.tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t)),
  })),
  tasksByDate: (date) => get().tasks.filter((t) => t.date === date),
}));

export default useTasksStore; 