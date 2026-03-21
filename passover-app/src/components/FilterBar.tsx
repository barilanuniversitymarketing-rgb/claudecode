import { useTaskStore } from '../store/useTaskStore';
import { CATEGORY_LABELS } from '../types';
import type { TaskCategory, TaskPriority } from '../types';
import { Icon } from './Icon';

export function FilterBar({ onAddTask }: { onAddTask: () => void }) {
  const { filters, setSearch, setFilterCategory, setFilterPriority, setFilterAssignee, clearFilters, familyMembers } = useTaskStore();
  const hasActive = filters.search || filters.category !== 'all' || filters.priority !== 'all' || filters.assigneeId !== 'all';

  const sel: React.CSSProperties = {
    padding: '0.5rem 0.75rem', borderRadius: '0.5rem',
    border: '1px solid var(--color-surface-container-high)',
    background: 'var(--color-surface-container-lowest)',
    color: 'var(--color-on-surface)',
    fontFamily: 'var(--font-body)', fontSize: '0.8rem',
    cursor: 'pointer', outline: 'none',
  };

  return (
    <div
      className="sticky z-40"
      style={{
        top: '64px',
        background: 'rgba(247,249,251,0.8)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--color-surface-container)',
        padding: '0.75rem 2rem',
      }}
    >
      <div className="max-w-[1600px] mx-auto flex flex-wrap gap-2 items-center">
        {/* Search */}
        <div className="relative flex-1" style={{ minWidth: '200px' }}>
          <span className="absolute" style={{ insetInlineEnd: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-outline)', pointerEvents: 'none' }}>
            <Icon name="search" size={16} />
          </span>
          <input
            type="text"
            value={filters.search}
            onChange={e => setSearch(e.target.value)}
            placeholder="חפש משימה..."
            style={{
              ...sel,
              width: '100%',
              paddingInlineEnd: '2.25rem',
              paddingInlineStart: '0.75rem',
              boxSizing: 'border-box',
            }}
          />
        </div>

        <select value={filters.category} onChange={e => setFilterCategory(e.target.value as TaskCategory | 'all')} style={sel}>
          <option value="all">כל הקטגוריות</option>
          {(Object.keys(CATEGORY_LABELS) as TaskCategory[]).map(c => (
            <option key={c} value={c}>{CATEGORY_LABELS[c]}</option>
          ))}
        </select>

        <select value={filters.priority} onChange={e => setFilterPriority(e.target.value as TaskPriority | 'all')} style={sel}>
          <option value="all">כל העדיפויות</option>
          <option value="high">דחוף</option>
          <option value="medium">חשוב</option>
          <option value="low">רגיל</option>
        </select>

        <select value={filters.assigneeId} onChange={e => setFilterAssignee(e.target.value)} style={sel}>
          <option value="all">כל האנשים</option>
          {familyMembers.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
        </select>

        {hasActive && (
          <button onClick={clearFilters} style={{ ...sel, color: 'var(--color-on-surface-variant)' }}>
            ✕ נקה
          </button>
        )}

        <div className="flex-1" />

        <button
          onClick={onAddTask}
          className="flex items-center gap-2 px-5 py-2 rounded-xl font-semibold transition-all hover:opacity-90 active:scale-95"
          style={{
            background: 'var(--color-primary)', color: '#fff',
            fontFamily: 'var(--font-body)', fontSize: '0.875rem',
            border: 'none', cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(0,68,132,0.2)',
          }}
        >
          <Icon name="add" size={18} />
          משימה חדשה
        </button>
      </div>
    </div>
  );
}
