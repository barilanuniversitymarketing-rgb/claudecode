import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Task, TaskStatus, TaskPriority, TaskCategory } from '../types';
import { CATEGORY_LABELS, CATEGORY_ICONS } from '../types';
import { useTaskStore } from '../store/useTaskStore';
import { Icon } from './Icon';

interface TaskModalProps {
  task?: Task | null;
  defaultStatus?: TaskStatus;
  onClose: () => void;
}

const CATEGORIES = Object.keys(CATEGORY_LABELS) as TaskCategory[];

export function TaskModal({ task, defaultStatus = 'todo', onClose }: TaskModalProps) {
  const { addTask, updateTask, familyMembers } = useTaskStore();
  const isEdit = !!task;

  const [form, setForm] = useState({
    title: task?.title ?? '',
    description: task?.description ?? '',
    status: task?.status ?? defaultStatus,
    priority: task?.priority ?? ('medium' as TaskPriority),
    category: task?.category ?? ('general' as TaskCategory),
    assigneeId: task?.assigneeId ?? '',
    dueDate: task?.dueDate ?? '',
    points: task?.points ?? 50,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  function validate() {
    const e: Record<string, string> = {};
    if (!form.title.trim()) e.title = 'שם המשימה נדרש';
    setErrors(e);
    return !Object.keys(e).length;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    const data = {
      title: form.title.trim(),
      description: form.description.trim() || undefined,
      status: form.status as TaskStatus,
      priority: form.priority as TaskPriority,
      category: form.category as TaskCategory,
      assigneeId: form.assigneeId || undefined,
      dueDate: form.dueDate || undefined,
      points: form.points,
    };
    if (isEdit && task) updateTask(task.id, data);
    else addTask(data);
    onClose();
  }

  const fieldStyle: React.CSSProperties = {
    width: '100%',
    padding: '0.75rem 1rem',
    borderRadius: '0.5rem',
    border: 'none',
    background: 'var(--color-surface-container-high)',
    color: 'var(--color-on-surface)',
    fontFamily: 'var(--font-body)',
    fontSize: '0.95rem',
    outline: 'none',
    boxSizing: 'border-box',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontFamily: 'var(--font-body)',
    fontSize: '0.8rem',
    fontWeight: 600,
    color: 'var(--color-on-surface-variant)',
    marginBottom: '0.4rem',
    paddingInlineStart: '0.25rem',
  };

  return (
    <AnimatePresence>
      <motion.div
        key="overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-[200] flex items-center justify-center p-4"
        style={{ background: 'rgba(25,28,30,0.5)', backdropFilter: 'blur(4px)' }}
      >
        <motion.div
          key="modal"
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 16 }}
          transition={{ type: 'spring', stiffness: 350, damping: 28 }}
          onClick={e => e.stopPropagation()}
          className="rounded-xl overflow-hidden flex flex-col"
          style={{
            background: 'var(--color-surface-container-lowest)',
            boxShadow: '0 -4px 24px -4px rgba(0,27,60,0.06), 0 20px 60px rgba(25,28,30,0.2)',
            width: '100%',
            maxWidth: '500px',
            maxHeight: '92vh',
          }}
        >
          {/* Header */}
          <div className="flex justify-between items-start px-6 pt-8 pb-4">
            <div>
              <h2
                className="text-2xl font-bold tracking-tight"
                style={{ fontFamily: 'var(--font-display)', color: 'var(--color-primary)' }}
              >
                {isEdit ? 'עריכת משימה' : 'הוספת משימה חדשה'}
              </h2>
              <p style={{ color: 'var(--color-on-surface-variant)', fontSize: '0.85rem', marginTop: '0.25rem' }}>
                נהלו את ההכנות לחג בצורה חכמה
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-surface-container transition-colors"
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-outline)' }}
            >
              <Icon name="close" size={20} />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-6 py-4 overflow-y-auto hide-scrollbar flex flex-col gap-6">

            {/* Task name */}
            <div>
              <label style={labelStyle}>שם המשימה</label>
              <input
                type="text"
                value={form.title}
                onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                placeholder="למשל: סידור שולחן הסדר"
                style={{ ...fieldStyle, outline: errors.title ? '2px solid var(--color-error)' : undefined }}
                autoFocus
              />
              {errors.title && (
                <p style={{ color: 'var(--color-error)', fontSize: '0.75rem', marginTop: '0.25rem', fontFamily: 'var(--font-body)' }}>
                  {errors.title}
                </p>
              )}
            </div>

            {/* Description */}
            <div>
              <label style={labelStyle}>תיאור (אופציונלי)</label>
              <textarea
                value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                placeholder="פרט את המשימה..."
                rows={2}
                style={{ ...fieldStyle, resize: 'vertical', lineHeight: 1.5 }}
              />
            </div>

            {/* Points slider */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label style={{ ...labelStyle, marginBottom: 0 }}>ניקוד (1-100)</label>
                <span style={{ color: 'var(--color-tertiary)', fontWeight: 700, fontSize: '1.1rem', fontFamily: 'var(--font-body)' }}>
                  {form.points}
                </span>
              </div>
              <input
                type="range"
                min={1}
                max={100}
                value={form.points}
                onChange={e => setForm(f => ({ ...f, points: Number(e.target.value) }))}
                style={{ accentColor: 'var(--color-primary)' }}
              />
            </div>

            {/* Category grid */}
            <div>
              <label style={labelStyle}>קטגוריה</label>
              <div className="grid grid-cols-3 gap-2">
                {CATEGORIES.map(cat => {
                  const active = form.category === cat;
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setForm(f => ({ ...f, category: cat }))}
                      className="flex flex-col items-center justify-center py-3 px-2 rounded-xl transition-all"
                      style={{
                        border: active ? '2px solid rgba(0,68,132,0.2)' : '2px solid transparent',
                        background: active ? 'rgba(0,68,132,0.06)' : 'var(--color-surface-container-low)',
                        cursor: 'pointer',
                        fontFamily: 'var(--font-body)',
                        color: active ? 'var(--color-primary)' : 'var(--color-on-surface)',
                      }}
                    >
                      <Icon name={CATEGORY_ICONS[cat]} size={20} style={{ color: active ? 'var(--color-primary)' : 'var(--color-on-surface-variant)' }} />
                      <span style={{ fontSize: '0.65rem', fontWeight: 700, marginTop: '0.2rem' }}>
                        {CATEGORY_LABELS[cat]}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Status + Priority row */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label style={labelStyle}>סטטוס</label>
                <select
                  value={form.status}
                  onChange={e => setForm(f => ({ ...f, status: e.target.value as TaskStatus }))}
                  style={fieldStyle}
                >
                  <option value="todo">לביצוע</option>
                  <option value="inprogress">בתהליך</option>
                  <option value="done">בוצע</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>עדיפות</label>
                <select
                  value={form.priority}
                  onChange={e => setForm(f => ({ ...f, priority: e.target.value as TaskPriority }))}
                  style={fieldStyle}
                >
                  <option value="high">דחוף</option>
                  <option value="medium">חשוב</option>
                  <option value="low">רגיל</option>
                </select>
              </div>
            </div>

            {/* Family member chips */}
            <div>
              <label style={labelStyle}>שיוך לבן משפחה</label>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setForm(f => ({ ...f, assigneeId: '' }))}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all text-xs font-semibold"
                  style={{
                    background: !form.assigneeId ? 'var(--color-primary-fixed)' : 'var(--color-surface-container)',
                    color: !form.assigneeId ? 'var(--color-primary)' : 'var(--color-on-surface-variant)',
                    border: 'none', cursor: 'pointer', fontFamily: 'var(--font-body)',
                  }}
                >
                  ללא שיוך
                </button>
                {familyMembers.map(member => {
                  const active = form.assigneeId === member.id;
                  return (
                    <button
                      key={member.id}
                      type="button"
                      onClick={() => setForm(f => ({ ...f, assigneeId: member.id }))}
                      className="flex items-center gap-1.5 rounded-full transition-all"
                      style={{
                        padding: '0.35rem 0.75rem 0.35rem 0.4rem',
                        background: active ? 'rgba(255,217,226,0.5)' : 'var(--color-surface-container)',
                        border: active ? '1px solid rgba(255,177,199,0.5)' : '1px solid transparent',
                        cursor: 'pointer',
                      }}
                    >
                      <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ background: member.color }}>
                        {member.name[0]}
                      </div>
                      <span style={{ fontSize: '0.75rem', fontWeight: 600, fontFamily: 'var(--font-body)', color: active ? 'var(--color-tertiary)' : 'var(--color-on-surface-variant)' }}>
                        {member.name.split(' ')[0]}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Due date */}
            <div>
              <label style={labelStyle}>תאריך יעד</label>
              <input
                type="date"
                value={form.dueDate}
                onChange={e => setForm(f => ({ ...f, dueDate: e.target.value }))}
                style={fieldStyle}
                min="2026-01-01"
                max="2026-12-31"
              />
            </div>
          </form>

          {/* Footer */}
          <div
            className="p-6 flex flex-col gap-3"
            style={{ background: 'rgba(242,244,246,0.5)', borderTop: '1px solid var(--color-surface-container)' }}
          >
            <button
              type="button"
              onClick={handleSubmit as unknown as React.MouseEventHandler}
              className="w-full py-4 rounded-xl font-bold text-lg transition-all hover:opacity-90 active:scale-[0.98]"
              style={{
                background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-container))',
                color: '#fff',
                fontFamily: 'var(--font-body)',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(0,68,132,0.2)',
              }}
            >
              {isEdit ? 'שמור שינויים' : 'צור משימה'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-full py-3 font-semibold transition-colors hover:text-primary"
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-outline)', fontFamily: 'var(--font-body)' }}
            >
              ביטול
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
