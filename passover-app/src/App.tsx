import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Header } from './components/Header';
import { FilterBar } from './components/FilterBar';
import { KanbanBoard } from './components/KanbanBoard';
import { ListView } from './components/ListView';
import { TaskModal } from './components/TaskModal';
import { useTaskStore } from './store/useTaskStore';
import type { Task, TaskStatus } from './types';

export default function App() {
  const { activeView } = useTaskStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [defaultStatus, setDefaultStatus] = useState<TaskStatus>('todo');

  function handleAddTask(status: TaskStatus = 'todo') {
    setEditingTask(null);
    setDefaultStatus(status);
    setModalOpen(true);
  }

  function handleEditTask(task: Task) {
    setEditingTask(task);
    setModalOpen(true);
  }

  function handleCloseModal() {
    setModalOpen(false);
    setEditingTask(null);
  }

  return (
    <div
      dir="rtl"
      style={{
        minHeight: '100vh',
        background: 'var(--color-background)',
        fontFamily: 'var(--font-body)',
        color: 'var(--color-text-primary)',
      }}
    >
      <Header />
      <FilterBar onAddTask={() => handleAddTask()} />

      <main>
        {activeView === 'kanban' ? (
          <KanbanBoard onEdit={handleEditTask} onAddTask={handleAddTask} />
        ) : (
          <ListView onEdit={handleEditTask} onAddTask={handleAddTask} />
        )}
      </main>

      <AnimatePresence>
        {modalOpen && (
          <TaskModal
            key="modal"
            task={editingTask}
            defaultStatus={defaultStatus}
            onClose={handleCloseModal}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
