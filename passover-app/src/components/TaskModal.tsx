import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Task, TaskStatus, TaskPriority, TaskCategory } from '../types';
import {
  CATEGORY_LABELS,
  CATEGORY_EMOJIS,
  PRIORITY_LABELS,
  FAMILY_MEMBERS,
} from '../types';
import { useTaskStore } from '../store/useTaskStore';

interface TaskModalProps {
  task?: Task | null;
  defaultStatus?: TaskStatus;
  onClose: () => void;
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '0.6rem 0.875rem',
  borderRadius: 'var(--border-radius-sm)',
  border: '1.5px solid var(--color-border)',
  background: 'var(--color-surface)',
  color: 'var(--color-text-primary)',
  fontFamily: 'var(--font-body)',
  fontSize: 'var(--font-size-base)',
  outline: 'none',
  boxSizing: 'border-box',
  transition: 'border-color var(--transition-fast)',
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontFamily: 'var(--font-body)',
  fontSize: 'var(--font-size-sm)',
  fontWeight: 'var(--font-weight-semibold)',
  color: 'var(--color-text-secondary)',
  marginBottom: '0.35rem',
};

export function TaskModal({ task, defaultStatus = 'todo', onClose }: TaskModalProps) {
  const { addTask, updateTask } = useTaskStore();
  const isEdit = !!task;

  const [form, setForm] = useState({
    title: task?.title ?? '',
    description: task?.description ?? '',
    status: task?.status ?? defaultStatus,
    priority: task?.priority ?? ('medium' as TaskPriority),
    category: task?.category ?? ('general' as TaskCategory),
    assignee: task?.assignee ?? '',
    dueDate: task?.dueDate ?? '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  function validate() {
    const newErrors: Record<string, string> = {};
    if (!form.title.trim()) newErrors.title = 'שם המשימה נדרש';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    if (isEdit && task) {
      updateTask(task.id, {
        title: form.title.trim(),
        description: form.description.trim() || undefined,
        status: form.status as TaskStatus,
        priority: form.priority as TaskPriority,
        category: form.category as TaskCategory,
        assignee: form.assignee || undefined,
        dueDate: form.dueDate || undefined,
      });
    } else {
      addTask({
        title: form.title.trim(),
        description: form.description.trim() || undefined,
        status: form.status as TaskStatus,
        priority: form.priority as TaskPriority,
        category: form.category as TaskCategory,
        assignee: form.assignee || undefined,
        dueDate: form.dueDate || undefined,
      });
    }
    onClose();
  }

  return (
    <AnimatePresence>
      <motion.div
        key="overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(44,24,16,0.5)',
          zIndex: 200,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 'var(--spacing-md)',
        }}
      >
        <motion.div
          key="modal"
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', stiffness: 350, damping: 28 }}
          onClick={(e) => e.stopPropagation()}
          style={{
            background: 'var(--color-card)',
            borderRadius: 'var(--border-radius-lg)',
            boxShadow: 'var(--shadow-modal)',
            width: '100%',
            maxWidth: '520px',
            maxHeight: '90vh',
            overflow: 'auto',
          }}
        >
          {/* Modal header */}
          <div
            style={{
              padding: 'var(--spacing-lg)',
              borderBottom: '1px solid var(--color-border)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: 'linear-gradient(135deg, var(--color-primary-dark), var(--color-primary))',
              borderRadius: 'var(--border-radius-lg) var(--border-radius-lg) 0 0',
              color: '#fff',
            }}
          >
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'var(--font-size-xl)',
                margin: 0,
                fontWeight: 'var(--font-weight-bold)',
              }}
            >
              {isEdit ? '✏️ עריכת משימה' : '✨ משימה חדשה'}
            </h2>
            <button
              onClick={onClose}
              style={{
                background: 'rgba(255,255,255,0.2)',
                border: 'none',
                color: '#fff',
                borderRadius: 'var(--border-radius-full)',
                width: '32px',
                height: '32px',
                cursor: 'pointer',
                fontSize: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              ✕
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ padding: 'var(--spacing-lg)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>

              {/* Title */}
              <div>
                <label style={labelStyle}>שם המשימה *</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="הכנס שם משימה..."
                  style={{
                    ...inputStyle,
                    borderColor: errors.title ? 'var(--color-priority-high)' : 'var(--color-border)',
                  }}
                  autoFocus
                />
                {errors.title && (
                  <p style={{ color: 'var(--color-priority-high)', fontSize: 'var(--font-size-xs)', margin: '0.25rem 0 0', fontFamily: 'var(--font-body)' }}>
                    {errors.title}
                  </p>
                )}
              </div>

              {/* Description */}
              <div>
                <label style={labelStyle}>תיאור (אופציונלי)</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="פרט את המשימה..."
                  rows={3}
                  style={{
                    ...inputStyle,
                    resize: 'vertical',
                    lineHeight: 1.5,
                  }}
                />
              </div>

              {/* Two-column row: Status + Priority */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-md)' }}>
                <div>
                  <label style={labelStyle}>סטטוס</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value as TaskStatus })}
                    style={inputStyle}
                  >
                    <option value="todo">📋 לעשות</option>
                    <option value="inprogress">⏳ בתהליך</option>
                    <option value="done">✅ הושלם</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>עדיפות</label>
                  <select
                    value={form.priority}
                    onChange={(e) => setForm({ ...form, priority: e.target.value as TaskPriority })}
                    style={inputStyle}
                  >
                    {(Object.keys(PRIORITY_LABELS) as TaskPriority[]).map((p) => (
                      <option key={p} value={p}>{PRIORITY_LABELS[p]}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Category */}
              <div>
                <label style={labelStyle}>קטגוריה</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value as TaskCategory })}
                  style={inputStyle}
                >
                  {(Object.keys(CATEGORY_LABELS) as TaskCategory[]).map((cat) => (
                    <option key={cat} value={cat}>
                      {CATEGORY_EMOJIS[cat]} {CATEGORY_LABELS[cat]}
                    </option>
                  ))}
                </select>
              </div>

              {/* Two-column row: Assignee + Due date */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-md)' }}>
                <div>
                  <label style={labelStyle}>מוטל על</label>
                  <select
                    value={form.assignee}
                    onChange={(e) => setForm({ ...form, assignee: e.target.value })}
                    style={inputStyle}
                  >
                    <option value="">— לא הוקצה —</option>
                    {FAMILY_MEMBERS.map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>תאריך יעד</label>
                  <input
                    type="date"
                    value={form.dueDate}
                    onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                    style={inputStyle}
                    min="2026-01-01"
                    max="2026-12-31"
                  />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div
              style={{
                display: 'flex',
                gap: 'var(--spacing-sm)',
                justifyContent: 'flex-start',
                marginTop: 'var(--spacing-lg)',
                paddingTop: 'var(--spacing-md)',
                borderTop: '1px solid var(--color-border)',
              }}
            >
              <button
                type="submit"
                style={{
                  padding: '0.6rem 1.5rem',
                  borderRadius: 'var(--border-radius-sm)',
                  border: 'none',
                  background: 'var(--color-primary)',
                  color: '#fff',
                  fontFamily: 'var(--font-body)',
                  fontSize: 'var(--font-size-base)',
                  fontWeight: 'var(--font-weight-semibold)',
                  cursor: 'pointer',
                  transition: 'background var(--transition-fast)',
                }}
                onMouseOver={(e) => ((e.currentTarget as HTMLButtonElement).style.background = 'var(--color-primary-dark)')}
                onMouseOut={(e) => ((e.currentTarget as HTMLButtonElement).style.background = 'var(--color-primary)')}
              >
                {isEdit ? '💾 שמור שינויים' : '✨ צור משימה'}
              </button>
              <button
                type="button"
                onClick={onClose}
                style={{
                  padding: '0.6rem 1.25rem',
                  borderRadius: 'var(--border-radius-sm)',
                  border: '1.5px solid var(--color-border)',
                  background: 'transparent',
                  color: 'var(--color-text-secondary)',
                  fontFamily: 'var(--font-body)',
                  fontSize: 'var(--font-size-base)',
                  cursor: 'pointer',
                }}
              >
                ביטול
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
