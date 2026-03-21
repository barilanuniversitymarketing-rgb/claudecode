import { useState } from 'react';
import { motion } from 'framer-motion';
import { useSwipeable } from 'react-swipeable';
import type { Task, TaskStatus } from '../types';
import {
  CATEGORY_LABELS,
  CATEGORY_EMOJIS,
  PRIORITY_LABELS,
  COLUMNS,
} from '../types';
import { useTaskStore } from '../store/useTaskStore';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  isDragging?: boolean;
}

const priorityColors: Record<string, string> = {
  high: 'var(--color-priority-high)',
  medium: 'var(--color-priority-medium)',
  low: 'var(--color-priority-low)',
};

const priorityBg: Record<string, string> = {
  high: 'var(--color-priority-high-bg)',
  medium: 'var(--color-priority-medium-bg)',
  low: 'var(--color-priority-low-bg)',
};

const categoryColors: Record<string, string> = {
  cleaning: 'var(--color-cat-cleaning)',
  food: 'var(--color-cat-food)',
  shopping: 'var(--color-cat-shopping)',
  guests: 'var(--color-cat-guests)',
  ceremony: 'var(--color-cat-ceremony)',
  kids: 'var(--color-cat-kids)',
  general: 'var(--color-cat-general)',
};

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('he-IL', { day: 'numeric', month: 'long' });
}

function isOverdue(dateStr: string): boolean {
  return new Date(dateStr) < new Date();
}

export function TaskCard({ task, onEdit, isDragging }: TaskCardProps) {
  const { deleteTask, moveTask } = useTaskStore();
  const [showMenu, setShowMenu] = useState(false);
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);

  const nextStatuses = COLUMNS.filter((c) => c.id !== task.status);

  const swipeHandlers = useSwipeable({
    onSwiping: (e) => {
      setIsSwiping(true);
      // RTL: swipe right = positive deltaX = move back, swipe left = negative = move forward
      setSwipeOffset(Math.max(-80, Math.min(80, e.deltaX)));
    },
    onSwipedLeft: () => {
      // Move to next status in RTL (left = forward in Hebrew layout)
      const nextStatus = nextStatuses[0];
      if (nextStatus) moveTask(task.id, nextStatus.id);
      setSwipeOffset(0);
      setIsSwiping(false);
    },
    onSwipedRight: () => {
      setSwipeOffset(0);
      setIsSwiping(false);
    },
    onTouchEndOrOnMouseUp: () => {
      setSwipeOffset(0);
      setIsSwiping(false);
    },
    trackMouse: false,
    trackTouch: true,
    delta: 10,
  });

  const overdue = task.dueDate && isOverdue(task.dueDate) && task.status !== 'done';

  return (
    <div
      style={{ position: 'relative', marginBottom: 'var(--spacing-sm)' }}
      {...swipeHandlers}
    >
      {/* Swipe hint background */}
      {isSwiping && swipeOffset < -20 && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: 'var(--border-radius-card)',
            background: 'var(--color-status-done-bg)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
            paddingInlineStart: '1rem',
            color: 'var(--color-status-done)',
            fontFamily: 'var(--font-body)',
            fontSize: 'var(--font-size-sm)',
            fontWeight: 'var(--font-weight-semibold)',
          }}
        >
          ✅ העבר
        </div>
      )}

      <motion.div
        layout
        animate={{
          x: swipeOffset,
          scale: isDragging ? 1.03 : 1,
          opacity: isDragging ? 0.9 : 1,
        }}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        style={{
          background: task.status === 'done' ? 'var(--color-status-done-bg)' : 'var(--color-card)',
          borderRadius: 'var(--border-radius-card)',
          boxShadow: isDragging ? 'var(--shadow-card-hover)' : 'var(--shadow-card)',
          padding: 'var(--spacing-md)',
          cursor: 'grab',
          borderInlineStart: `4px solid ${categoryColors[task.category] || 'var(--color-border)'}`,
          position: 'relative',
          transition: isSwiping ? 'none' : undefined,
        }}
        whileHover={{ boxShadow: 'var(--shadow-card-hover)', y: -1 }}
      >
        {/* Card header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: 'var(--spacing-sm)',
            marginBottom: 'var(--spacing-sm)',
          }}
        >
          <h3
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--font-size-base)',
              fontWeight: 'var(--font-weight-semibold)',
              color: task.status === 'done' ? 'var(--color-text-muted)' : 'var(--color-text-primary)',
              margin: 0,
              textDecoration: task.status === 'done' ? 'line-through' : 'none',
              flex: 1,
              lineHeight: 1.4,
            }}
          >
            {task.title}
          </h3>

          {/* Menu button */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(!showMenu);
              }}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--color-text-muted)',
                fontSize: '1.1rem',
                lineHeight: 1,
                padding: '0.1rem 0.3rem',
                borderRadius: 'var(--border-radius-sm)',
              }}
            >
              ⋯
            </button>
            {showMenu && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: -5 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                style={{
                  position: 'absolute',
                  top: '100%',
                  insetInlineEnd: 0,
                  background: 'var(--color-card)',
                  borderRadius: 'var(--border-radius-sm)',
                  boxShadow: 'var(--shadow-card-hover)',
                  border: '1px solid var(--color-border)',
                  zIndex: 50,
                  minWidth: '150px',
                  overflow: 'hidden',
                }}
                onMouseLeave={() => setShowMenu(false)}
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(task);
                    setShowMenu(false);
                  }}
                  style={menuItemStyle}
                >
                  ✏️ ערוך
                </button>

                {nextStatuses.map((col) => (
                  <button
                    key={col.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      moveTask(task.id, col.id as TaskStatus);
                      setShowMenu(false);
                    }}
                    style={menuItemStyle}
                  >
                    {col.emoji} העבר ל{col.title}
                  </button>
                ))}

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteTask(task.id);
                    setShowMenu(false);
                  }}
                  style={{ ...menuItemStyle, color: 'var(--color-priority-high)' }}
                >
                  🗑️ מחק
                </button>
              </motion.div>
            )}
          </div>
        </div>

        {/* Description */}
        {task.description && (
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--font-size-sm)',
              color: 'var(--color-text-secondary)',
              margin: '0 0 var(--spacing-sm)',
              lineHeight: 1.5,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {task.description}
          </p>
        )}

        {/* Tags row */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.3rem',
            marginBottom: 'var(--spacing-sm)',
          }}
        >
          {/* Category badge */}
          <span
            style={{
              fontSize: 'var(--font-size-xs)',
              padding: '0.2rem 0.5rem',
              borderRadius: 'var(--border-radius-full)',
              background: `${categoryColors[task.category]}18`,
              color: categoryColors[task.category],
              fontFamily: 'var(--font-body)',
              fontWeight: 'var(--font-weight-medium)',
            }}
          >
            {CATEGORY_EMOJIS[task.category]} {CATEGORY_LABELS[task.category]}
          </span>

          {/* Priority badge */}
          <span
            style={{
              fontSize: 'var(--font-size-xs)',
              padding: '0.2rem 0.5rem',
              borderRadius: 'var(--border-radius-full)',
              background: priorityBg[task.priority],
              color: priorityColors[task.priority],
              fontFamily: 'var(--font-body)',
              fontWeight: 'var(--font-weight-medium)',
            }}
          >
            {task.priority === 'high' ? '🔴' : task.priority === 'medium' ? '🟡' : '🟢'}{' '}
            {PRIORITY_LABELS[task.priority]}
          </span>
        </div>

        {/* Footer row */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 'var(--spacing-sm)',
          }}
        >
          {/* Assignee */}
          {task.assignee && (
            <span
              style={{
                fontSize: 'var(--font-size-xs)',
                color: 'var(--color-text-muted)',
                fontFamily: 'var(--font-body)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem',
              }}
            >
              👤 {task.assignee}
            </span>
          )}

          {/* Due date */}
          {task.dueDate && (
            <span
              style={{
                fontSize: 'var(--font-size-xs)',
                fontFamily: 'var(--font-body)',
                color: overdue ? 'var(--color-priority-high)' : 'var(--color-text-muted)',
                fontWeight: overdue ? 'var(--font-weight-semibold)' : 'var(--font-weight-normal)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem',
              }}
            >
              {overdue ? '⚠️' : '📅'} {formatDate(task.dueDate)}
            </span>
          )}
        </div>
      </motion.div>
    </div>
  );
}

const menuItemStyle: React.CSSProperties = {
  display: 'block',
  width: '100%',
  padding: '0.6rem 1rem',
  border: 'none',
  background: 'none',
  cursor: 'pointer',
  fontFamily: 'var(--font-body)',
  fontSize: 'var(--font-size-sm)',
  color: 'var(--color-text-primary)',
  textAlign: 'right',
  transition: 'background var(--transition-fast)',
};
