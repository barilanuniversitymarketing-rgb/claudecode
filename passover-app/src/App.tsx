import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { TopNav } from './components/TopNav';
import { BottomNav } from './components/BottomNav';
import { FilterBar } from './components/FilterBar';
import { KanbanBoard } from './components/KanbanBoard';
import { LeaderboardView } from './components/LeaderboardView';
import { ManagementView } from './components/ManagementView';
import { ProfileView } from './components/ProfileView';
import { TaskModal } from './components/TaskModal';
import { Icon } from './components/Icon';
import { useTaskStore } from './store/useTaskStore';
import type { Task, TaskStatus } from './types';

export default function App() {
  const { activeView, profileMemberId } = useTaskStore();
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

  const showFilterBar = activeView === 'dashboard';

  return (
    <div dir="rtl" className="santorini-bg min-h-screen font-body text-on-surface">
      <TopNav />

      {showFilterBar && (
        <FilterBar onAddTask={() => handleAddTask()} />
      )}

      {/* Main content area */}
      <main style={{ paddingTop: showFilterBar ? '0' : '4rem' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeView + (profileMemberId ?? '')}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            {activeView === 'dashboard' && (
              <KanbanBoard onEdit={handleEditTask} onAddTask={handleAddTask} />
            )}
            {activeView === 'leaderboard' && <LeaderboardView />}
            {activeView === 'management' && <ManagementView onEditTask={handleEditTask} />}
            {activeView === 'profile' && profileMemberId && (
              <ProfileView memberId={profileMemberId} />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      <BottomNav />

      {/* FAB (mobile) */}
      {activeView === 'dashboard' && (
        <button
          onClick={() => handleAddTask()}
          className="md:hidden fixed z-40 w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-transform active:scale-90"
          style={{
            bottom: '6rem',
            insetInlineStart: '1.5rem',
            background: 'var(--color-tertiary)',
            color: '#fff',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 8px 24px rgba(137,0,69,0.35)',
          }}
        >
          <Icon name="add" size={28} />
        </button>
      )}

      {/* Desktop FAB */}
      <button
        onClick={() => handleAddTask()}
        className="hidden md:flex fixed z-40 w-14 h-14 rounded-full items-center justify-center transition-all hover:scale-110 active:scale-95 shadow-2xl"
        style={{
          bottom: '2rem',
          insetInlineStart: '2rem',
          background: 'var(--color-tertiary)',
          color: '#fff',
          border: 'none',
          cursor: 'pointer',
          boxShadow: '0 8px 24px rgba(137,0,69,0.35)',
        }}
      >
        <Icon name={activeView === 'dashboard' ? 'add' : 'wine_bar'} size={26} />
      </button>

      {/* Ambient background accents */}
      <div className="fixed top-20 -left-10 -z-10 w-64 h-64 rounded-full" style={{ background: 'rgba(0,68,132,0.04)', filter: 'blur(3rem)', pointerEvents: 'none' }} />
      <div className="fixed bottom-40 -right-20 -z-10 w-96 h-96 rounded-full" style={{ background: 'rgba(137,0,69,0.04)', filter: 'blur(3rem)', pointerEvents: 'none' }} />

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
