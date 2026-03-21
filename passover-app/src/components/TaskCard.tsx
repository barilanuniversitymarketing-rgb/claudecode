import { useState } from 'react';
import { motion } from 'framer-motion';
import { useSwipeable } from 'react-swipeable';
import type { Task, TaskStatus } from '../types';
import { COLUMNS } from '../types';
import { useTaskStore } from '../store/useTaskStore';
import { Icon } from './Icon';
import { MemberAvatar } from './MemberAvatar';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  isDragging?: boolean;
}

const PRIORITY_BADGE: Record<string, { bg: string; color: string; label: string }> = {
  high:   { bg: 'rgba(137,0,69,0.1)',  color: 'var(--color-tertiary)',         label: 'דחוף' },
  medium: { bg: 'rgba(0,91,174,0.1)',  color: 'var(--color-primary-container)', label: 'חשוב' },
  low:    { bg: 'var(--color-surface-container)', color: 'var(--color-on-surface-variant)', label: 'רגיל' },
};

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('he-IL', { day: 'numeric', month: 'short' });
}

export function TaskCard({ task, onEdit, isDragging }: TaskCardProps) {
  const { deleteTask, moveTask, getMemberById } = useTaskStore();
  const [showMenu, setShowMenu] = useState(false);
  const [swipeX, setSwipeX] = useState(0);
  const assignee = task.assigneeId ? getMemberById(task.assigneeId) : undefined;
  const nextCols = COLUMNS.filter(c => c.id !== task.status);
  const badge = PRIORITY_BADGE[task.priority];
  const isDone = task.status === 'done';

  const swipeHandlers = useSwipeable({
    onSwiping: e => setSwipeX(Math.max(-70, Math.min(0, e.deltaX))),
    onSwipedLeft: () => {
      if (nextCols[0]) moveTask(task.id, nextCols[0].id as TaskStatus);
      setSwipeX(0);
    },
    onTouchEndOrOnMouseUp: () => setSwipeX(0),
    trackMouse: false,
    delta: 15,
  });

  return (
    <div className="relative mb-3" {...swipeHandlers}>
      {/* Swipe hint */}
      {swipeX < -20 && (
        <div
          className="absolute inset-0 flex items-center justify-start ps-4 rounded-xl"
          style={{ background: 'var(--color-primary-fixed)', color: 'var(--color-primary)', fontSize: '0.8rem', fontWeight: 600 }}
        >
          <Icon name="check_circle" size={18} filled /> &nbsp;{nextCols[0]?.title}
        </div>
      )}

      <motion.div
        layout
        animate={{ x: swipeX, scale: isDragging ? 1.02 : 1, opacity: isDragging ? 0.8 : 1 }}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        whileHover={{ y: -2, boxShadow: '0 8px 24px rgba(0,27,60,0.12)' }}
        className="rounded-xl cursor-grab select-none"
        style={{
          background: isDone ? 'rgba(242,244,246,0.7)' : 'var(--color-surface-container-lowest)',
          boxShadow: isDragging ? '0 8px 24px rgba(0,27,60,0.16)' : '0 2px 8px rgba(0,27,60,0.06)',
          padding: '1.25rem',
          border: '1px solid var(--color-surface-container-high)',
          opacity: isDone ? 0.75 : 1,
        }}
        onClick={() => { if (!isDragging) setShowMenu(false); }}
      >
        {/* Top row: priority badge + menu */}
        <div className="flex justify-between items-start mb-3">
          <span
            className="text-xs font-bold uppercase px-2 py-1 rounded"
            style={{ background: badge.bg, color: badge.color, fontSize: '0.65rem', letterSpacing: '0.05em' }}
          >
            {badge.label}
          </span>

          <div className="relative">
            <button
              onClick={e => { e.stopPropagation(); setShowMenu(v => !v); }}
              className="p-1 rounded-full hover:bg-surface-container transition-colors"
              style={{ color: 'var(--color-on-surface-variant)', background: 'none', border: 'none', cursor: 'pointer' }}
            >
              <Icon name="more_vert" size={18} />
            </button>

            {showMenu && (
              <motion.div
                initial={{ opacity: 0, scale: 0.92, y: -6 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="absolute rounded-xl overflow-hidden z-50"
                style={{
                  top: '100%', insetInlineEnd: 0, minWidth: '160px',
                  background: 'var(--color-surface-container-lowest)',
                  boxShadow: '0 8px 24px rgba(0,27,60,0.14)',
                  border: '1px solid var(--color-surface-container-high)',
                }}
                onMouseLeave={() => setShowMenu(false)}
              >
                {[
                  { label: 'ערוך', icon: 'edit', action: () => { onEdit(task); setShowMenu(false); } },
                  ...nextCols.map(c => ({
                    label: `העבר ל${c.title}`, icon: 'move_down',
                    action: () => { moveTask(task.id, c.id as TaskStatus); setShowMenu(false); }
                  })),
                  { label: 'מחק', icon: 'delete', action: () => { deleteTask(task.id); setShowMenu(false); }, danger: true },
                ].map((item, i) => (
                  <button
                    key={i}
                    onClick={e => { e.stopPropagation(); (item as { action: () => void }).action(); }}
                    className="flex items-center gap-2 w-full px-4 py-3 text-sm text-right hover:bg-surface-container transition-colors"
                    style={{
                      fontFamily: 'var(--font-body)', border: 'none', background: 'none', cursor: 'pointer',
                      color: (item as { danger?: boolean }).danger ? 'var(--color-error)' : 'var(--color-on-surface)',
                    }}
                  >
                    <Icon name={item.icon} size={16} />
                    {item.label}
                  </button>
                ))}
              </motion.div>
            )}
          </div>
        </div>

        {/* Title */}
        <h3
          className="font-bold leading-tight mb-4"
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '1rem',
            color: isDone ? 'var(--color-on-surface-variant)' : 'var(--color-on-surface)',
            textDecoration: isDone ? 'line-through' : 'none',
          }}
        >
          {task.title}
        </h3>

        {/* Progress bar (for in-progress tasks) */}
        {task.status === 'inprogress' && task.progress !== undefined && (
          <div className="mb-4">
            <div className="flex justify-between items-center mb-1.5" style={{ fontSize: '0.7rem', color: 'var(--color-on-surface-variant)' }}>
              <span>התקדמות</span>
              <span>{task.progress}%</span>
            </div>
            <div className="rounded-full overflow-hidden" style={{ height: '6px', background: 'var(--color-surface-container-high)' }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${task.progress}%` }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                style={{ height: '100%', background: 'var(--color-primary)', borderRadius: '9999px' }}
              />
            </div>
          </div>
        )}

        {/* Footer */}
        <div
          className="flex justify-between items-center pt-3"
          style={{ borderTop: '1px solid var(--color-surface-container-low)' }}
        >
          {/* Points */}
          <div className="flex items-center gap-1" style={{ color: 'var(--color-primary)' }}>
            <Icon name="star" size={16} filled />
            <span style={{ fontWeight: 700, fontSize: '0.8rem' }}>{task.points}</span>
          </div>

          {/* Category icon + due date + assignee */}
          <div className="flex items-center gap-2">
            {task.dueDate && (
              <div className="flex items-center gap-1" style={{ color: 'var(--color-on-surface-variant)', fontSize: '0.7rem' }}>
                <Icon name="calendar_today" size={13} />
                <span>{formatDate(task.dueDate)}</span>
              </div>
            )}
            {assignee && <MemberAvatar member={assignee} size={26} showBorder />}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
