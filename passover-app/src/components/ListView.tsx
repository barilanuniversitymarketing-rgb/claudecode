import { motion, AnimatePresence } from 'framer-motion';
import type { Task, TaskStatus } from '../types';
import { COLUMNS, CATEGORY_LABELS, CATEGORY_EMOJIS, PRIORITY_LABELS } from '../types';
import { useTaskStore } from '../store/useTaskStore';

interface ListViewProps {
  onEdit: (task: Task) => void;
  onAddTask: (status: TaskStatus) => void;
}

const priorityColors: Record<string, string> = {
  high: 'var(--color-priority-high)',
  medium: 'var(--color-priority-medium)',
  low: 'var(--color-priority-low)',
};

const statusColors: Record<string, string> = {
  todo: 'var(--color-status-todo)',
  inprogress: 'var(--color-status-inprogress)',
  done: 'var(--color-status-done)',
};

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('he-IL', { day: 'numeric', month: 'long' });
}

function isOverdue(dateStr: string): boolean {
  return new Date(dateStr) < new Date();
}

export function ListView({ onEdit, onAddTask }: ListViewProps) {
  const { getFilteredTasks, moveTask, deleteTask } = useTaskStore();
  const tasks = getFilteredTasks();

  return (
    <div
      style={{
        maxWidth: '900px',
        margin: '0 auto',
        padding: 'var(--spacing-xl)',
      }}
    >
      {COLUMNS.map((column) => {
        const columnTasks = tasks.filter((t) => t.status === column.id);
        return (
          <div key={column.id} style={{ marginBottom: 'var(--spacing-xl)' }}>
            {/* Section header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 'var(--spacing-md)',
                paddingBottom: 'var(--spacing-sm)',
                borderBottom: `2px solid ${statusColors[column.id]}`,
              }}
            >
              <h2
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'var(--font-size-xl)',
                  color: statusColors[column.id],
                  margin: 0,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--spacing-sm)',
                }}
              >
                {column.emoji} {column.title}
                <span
                  style={{
                    background: statusColors[column.id],
                    color: '#fff',
                    borderRadius: 'var(--border-radius-full)',
                    width: '22px',
                    height: '22px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 'var(--font-size-xs)',
                    fontFamily: 'var(--font-body)',
                    fontWeight: 'var(--font-weight-bold)',
                  }}
                >
                  {columnTasks.length}
                </span>
              </h2>
              <button
                onClick={() => onAddTask(column.id)}
                style={{
                  padding: '0.35rem 0.75rem',
                  borderRadius: 'var(--border-radius-sm)',
                  border: `1.5px solid ${statusColors[column.id]}`,
                  background: 'transparent',
                  color: statusColors[column.id],
                  fontFamily: 'var(--font-body)',
                  fontSize: 'var(--font-size-sm)',
                  cursor: 'pointer',
                  fontWeight: 'var(--font-weight-semibold)',
                }}
              >
                + הוסף
              </button>
            </div>

            {/* Task rows */}
            <AnimatePresence>
              {columnTasks.length === 0 ? (
                <div
                  style={{
                    textAlign: 'center',
                    padding: 'var(--spacing-lg)',
                    color: 'var(--color-text-muted)',
                    fontFamily: 'var(--font-body)',
                    fontSize: 'var(--font-size-sm)',
                    background: 'var(--color-surface)',
                    borderRadius: 'var(--border-radius-card)',
                  }}
                >
                  אין משימות בקטגוריה זו
                </div>
              ) : (
                columnTasks.map((task) => (
                  <ListTaskRow
                    key={task.id}
                    task={task}
                    onEdit={onEdit}
                    moveTask={moveTask}
                    deleteTask={deleteTask}
                  />
                ))
              )}
            </AnimatePresence>
          </div>
        );
      })}

      {tasks.length === 0 && (
        <div
          style={{
            textAlign: 'center',
            padding: 'var(--spacing-2xl)',
            color: 'var(--color-text-muted)',
            fontFamily: 'var(--font-body)',
          }}
        >
          <div style={{ fontSize: '3rem', marginBottom: 'var(--spacing-md)' }}>🔍</div>
          <div style={{ fontSize: 'var(--font-size-lg)' }}>לא נמצאו משימות</div>
          <div style={{ fontSize: 'var(--font-size-sm)', marginTop: 'var(--spacing-sm)', opacity: 0.7 }}>
            נסה לשנות את הסינון
          </div>
        </div>
      )}
    </div>
  );
}

function ListTaskRow({
  task,
  onEdit,
  moveTask,
  deleteTask,
}: {
  task: Task;
  onEdit: (t: Task) => void;
  moveTask: (id: string, status: TaskStatus) => void;
  deleteTask: (id: string) => void;
}) {
  const overdue = task.dueDate && isOverdue(task.dueDate) && task.status !== 'done';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, height: 0 }}
      style={{
        background: 'var(--color-card)',
        borderRadius: 'var(--border-radius-card)',
        boxShadow: 'var(--shadow-card)',
        padding: 'var(--spacing-md) var(--spacing-lg)',
        marginBottom: 'var(--spacing-sm)',
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--spacing-md)',
        borderInlineStart: `4px solid ${priorityColors[task.priority]}`,
        opacity: task.status === 'done' ? 0.7 : 1,
      }}
      whileHover={{ boxShadow: 'var(--shadow-card-hover)' }}
    >
      {/* Checkbox */}
      <button
        onClick={() => moveTask(task.id, task.status === 'done' ? 'todo' : 'done')}
        style={{
          flexShrink: 0,
          width: '22px',
          height: '22px',
          borderRadius: '50%',
          border: `2px solid ${task.status === 'done' ? 'var(--color-status-done)' : 'var(--color-border)'}`,
          background: task.status === 'done' ? 'var(--color-status-done)' : 'transparent',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          fontSize: '0.7rem',
          transition: 'all var(--transition-fast)',
        }}
      >
        {task.status === 'done' ? '✓' : ''}
      </button>

      {/* Category emoji */}
      <span style={{ fontSize: '1.1rem', flexShrink: 0 }}>{CATEGORY_EMOJIS[task.category]}</span>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'var(--font-size-base)',
            fontWeight: 'var(--font-weight-semibold)',
            color: 'var(--color-text-primary)',
            textDecoration: task.status === 'done' ? 'line-through' : 'none',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {task.title}
        </div>
        <div
          style={{
            display: 'flex',
            gap: 'var(--spacing-md)',
            marginTop: '0.2rem',
            flexWrap: 'wrap',
          }}
        >
          <span style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
            {CATEGORY_LABELS[task.category]}
          </span>
          {task.assignee && (
            <span style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
              👤 {task.assignee}
            </span>
          )}
          {task.dueDate && (
            <span
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'var(--font-size-xs)',
                color: overdue ? 'var(--color-priority-high)' : 'var(--color-text-muted)',
                fontWeight: overdue ? 'var(--font-weight-semibold)' : undefined,
              }}
            >
              {overdue ? '⚠️' : '📅'} {formatDate(task.dueDate)}
            </span>
          )}
        </div>
      </div>

      {/* Priority badge */}
      <span
        style={{
          flexShrink: 0,
          fontSize: 'var(--font-size-xs)',
          padding: '0.2rem 0.5rem',
          borderRadius: 'var(--border-radius-full)',
          background: `${priorityColors[task.priority]}18`,
          color: priorityColors[task.priority],
          fontFamily: 'var(--font-body)',
          fontWeight: 'var(--font-weight-medium)',
          whiteSpace: 'nowrap',
        }}
      >
        {PRIORITY_LABELS[task.priority]}
      </span>

      {/* Actions */}
      <div style={{ flexShrink: 0, display: 'flex', gap: '0.4rem' }}>
        <button
          onClick={() => onEdit(task)}
          title="ערוך"
          style={iconBtnStyle}
        >
          ✏️
        </button>
        <button
          onClick={() => deleteTask(task.id)}
          title="מחק"
          style={{ ...iconBtnStyle, color: 'var(--color-priority-high)' }}
        >
          🗑️
        </button>
      </div>
    </motion.div>
  );
}

const iconBtnStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  fontSize: '1rem',
  padding: '0.2rem 0.3rem',
  borderRadius: 'var(--border-radius-sm)',
  color: 'var(--color-text-muted)',
  transition: 'background var(--transition-fast)',
};
