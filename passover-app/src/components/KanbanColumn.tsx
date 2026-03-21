import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { motion, AnimatePresence } from 'framer-motion';
import type { Column, Task, TaskStatus } from '../types';
import { SortableTaskCard } from './SortableTaskCard';
import { Icon } from './Icon';

interface KanbanColumnProps {
  column: Column;
  tasks: Task[];
  onEdit: (task: Task) => void;
  onAddTask: (status: TaskStatus) => void;
}

const COL_COLORS: Record<string, { dot: string; count: string; countText: string }> = {
  todo:       { dot: '#94a3b8',        count: 'var(--color-surface-container-high)',  countText: 'var(--color-on-surface-variant)' },
  inprogress: { dot: 'var(--color-secondary)', count: 'var(--color-secondary-container)', countText: 'var(--color-on-secondary-container)' },
  done:       { dot: '#22c55e',        count: '#dcfce7', countText: '#16a34a' },
};

export function KanbanColumn({ column, tasks, onEdit, onAddTask }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: column.id });
  const col = COL_COLORS[column.id];

  return (
    <section className="flex flex-col gap-4" style={{ minWidth: '280px', flex: '1 1 280px', maxWidth: '420px' }}>
      {/* Column header */}
      <div className="flex items-center justify-between px-1 mb-1">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full" style={{ background: col.dot }} />
          <h2
            className="text-xl font-bold"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--color-primary)' }}
          >
            {column.title}
          </h2>
          <span
            className="px-2 py-0.5 rounded-full text-xs font-bold"
            style={{ background: col.count, color: col.countText }}
          >
            {tasks.length}
          </span>
        </div>
        <button
          onClick={() => onAddTask(column.id)}
          className="p-1 rounded-full transition-colors hover:bg-surface-container"
          style={{ color: 'var(--color-on-surface-variant)', background: 'none', border: 'none', cursor: 'pointer' }}
          title="הוסף משימה"
        >
          <Icon name="add" size={20} />
        </button>
      </div>

      {/* Drop zone */}
      <div
        ref={setNodeRef}
        className="flex flex-col flex-1 rounded-xl transition-all"
        style={{
          minHeight: '120px',
          background: isOver ? 'rgba(0,68,132,0.04)' : 'transparent',
          border: isOver ? '2px dashed var(--color-primary)' : '2px solid transparent',
          padding: '0.25rem',
        }}
      >
        <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
          <AnimatePresence mode="popLayout">
            {tasks.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center text-center"
                style={{
                  padding: '2.5rem 1rem', color: 'var(--color-on-surface-variant)',
                  fontFamily: 'var(--font-body)', fontSize: '0.875rem',
                }}
              >
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🫙</div>
                <div>אין משימות כאן</div>
                <div style={{ fontSize: '0.75rem', opacity: 0.6, marginTop: '0.25rem' }}>גרור משימה או לחץ +</div>
              </motion.div>
            ) : (
              tasks.map(task => (
                <SortableTaskCard key={task.id} task={task} onEdit={onEdit} />
              ))
            )}
          </AnimatePresence>
        </SortableContext>
      </div>
    </section>
  );
}
