import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { motion, AnimatePresence } from 'framer-motion';
import type { Column, Task, TaskStatus } from '../types';
import { SortableTaskCard } from './SortableTaskCard';

interface KanbanColumnProps {
  column: Column;
  tasks: Task[];
  onEdit: (task: Task) => void;
  onAddTask: (status: TaskStatus) => void;
}

const columnHeaderColors: Record<string, string> = {
  todo: 'var(--color-status-todo)',
  inprogress: 'var(--color-status-inprogress)',
  done: 'var(--color-status-done)',
};

const columnBgColors: Record<string, string> = {
  todo: 'var(--color-status-todo-bg)',
  inprogress: 'var(--color-status-inprogress-bg)',
  done: 'var(--color-status-done-bg)',
};

export function KanbanColumn({ column, tasks, onEdit, onAddTask }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: column.id });

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        minWidth: '300px',
        flex: '1 1 300px',
        maxWidth: '420px',
        background: columnBgColors[column.id],
        borderRadius: 'var(--border-radius-lg)',
        border: isOver
          ? `2px dashed ${columnHeaderColors[column.id]}`
          : '2px solid transparent',
        transition: 'border-color var(--transition-base)',
        overflow: 'hidden',
      }}
    >
      {/* Column header */}
      <div
        style={{
          padding: 'var(--spacing-md) var(--spacing-lg)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: `3px solid ${columnHeaderColors[column.id]}`,
          background: `${columnHeaderColors[column.id]}12`,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
          <span style={{ fontSize: '1.25rem' }}>{column.emoji}</span>
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'var(--font-size-lg)',
              fontWeight: 'var(--font-weight-bold)',
              color: columnHeaderColors[column.id],
              margin: 0,
            }}
          >
            {column.title}
          </h2>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
          <span
            style={{
              background: columnHeaderColors[column.id],
              color: '#fff',
              borderRadius: 'var(--border-radius-full)',
              width: '24px',
              height: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 'var(--font-size-xs)',
              fontWeight: 'var(--font-weight-bold)',
              fontFamily: 'var(--font-body)',
            }}
          >
            {tasks.length}
          </span>

          <button
            onClick={() => onAddTask(column.id)}
            title="הוסף משימה לעמודה"
            style={{
              background: columnHeaderColors[column.id],
              border: 'none',
              color: '#fff',
              borderRadius: 'var(--border-radius-full)',
              width: '24px',
              height: '24px',
              cursor: 'pointer',
              fontSize: '1.1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              lineHeight: 1,
            }}
          >
            +
          </button>
        </div>
      </div>

      {/* Tasks area */}
      <div
        ref={setNodeRef}
        style={{
          flex: 1,
          padding: 'var(--spacing-md)',
          minHeight: '120px',
          overflowY: 'auto',
        }}
      >
        <SortableContext
          items={tasks.map((t) => t.id)}
          strategy={verticalListSortingStrategy}
        >
          <AnimatePresence mode="popLayout">
            {tasks.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{
                  textAlign: 'center',
                  padding: 'var(--spacing-xl)',
                  color: 'var(--color-text-muted)',
                  fontFamily: 'var(--font-body)',
                  fontSize: 'var(--font-size-sm)',
                }}
              >
                <div style={{ fontSize: '2rem', marginBottom: 'var(--spacing-sm)' }}>🫙</div>
                <div>אין משימות כאן</div>
                <div style={{ fontSize: 'var(--font-size-xs)', marginTop: 'var(--spacing-xs)', opacity: 0.7 }}>
                  גרור משימה או לחץ +
                </div>
              </motion.div>
            ) : (
              tasks.map((task) => (
                <SortableTaskCard key={task.id} task={task} onEdit={onEdit} />
              ))
            )}
          </AnimatePresence>
        </SortableContext>
      </div>
    </div>
  );
}
