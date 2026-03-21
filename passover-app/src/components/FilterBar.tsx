import { useTaskStore } from '../store/useTaskStore';
import {
  CATEGORY_LABELS,
  CATEGORY_EMOJIS,
  PRIORITY_LABELS,
  FAMILY_MEMBERS,
} from '../types';
import type { TaskCategory, TaskPriority } from '../types';

export function FilterBar({ onAddTask }: { onAddTask: () => void }) {
  const {
    filters,
    setSearch,
    setFilterCategory,
    setFilterPriority,
    setFilterAssignee,
    clearFilters,
  } = useTaskStore();

  const hasActiveFilters =
    filters.search ||
    filters.category !== 'all' ||
    filters.priority !== 'all' ||
    filters.assignee !== 'all';

  const selectStyle: React.CSSProperties = {
    padding: '0.5rem 0.75rem',
    borderRadius: 'var(--border-radius-sm)',
    border: '1.5px solid var(--color-border)',
    background: 'var(--color-card)',
    color: 'var(--color-text-primary)',
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--font-size-sm)',
    cursor: 'pointer',
    outline: 'none',
    minWidth: '120px',
  };

  return (
    <div
      style={{
        background: 'var(--color-surface)',
        borderBottom: '1px solid var(--color-border)',
        padding: 'var(--spacing-md) var(--spacing-xl)',
      }}
    >
      <div
        style={{
          maxWidth: '1400px',
          margin: '0 auto',
          display: 'flex',
          flexWrap: 'wrap',
          gap: 'var(--spacing-sm)',
          alignItems: 'center',
        }}
      >
        {/* Search */}
        <div style={{ position: 'relative', flex: '1', minWidth: '200px' }}>
          <span
            style={{
              position: 'absolute',
              right: '0.75rem',
              top: '50%',
              transform: 'translateY(-50%)',
              fontSize: '1rem',
              opacity: 0.5,
            }}
          >
            🔍
          </span>
          <input
            type="text"
            placeholder="חפש משימה..."
            value={filters.search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: '100%',
              padding: '0.5rem 2.5rem 0.5rem 0.75rem',
              borderRadius: 'var(--border-radius-sm)',
              border: '1.5px solid var(--color-border)',
              background: 'var(--color-card)',
              color: 'var(--color-text-primary)',
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--font-size-sm)',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
        </div>

        {/* Category filter */}
        <select
          value={filters.category}
          onChange={(e) => setFilterCategory(e.target.value as TaskCategory | 'all')}
          style={selectStyle}
        >
          <option value="all">כל הקטגוריות</option>
          {(Object.keys(CATEGORY_LABELS) as TaskCategory[]).map((cat) => (
            <option key={cat} value={cat}>
              {CATEGORY_EMOJIS[cat]} {CATEGORY_LABELS[cat]}
            </option>
          ))}
        </select>

        {/* Priority filter */}
        <select
          value={filters.priority}
          onChange={(e) => setFilterPriority(e.target.value as TaskPriority | 'all')}
          style={selectStyle}
        >
          <option value="all">כל העדיפויות</option>
          {(Object.keys(PRIORITY_LABELS) as TaskPriority[]).map((p) => (
            <option key={p} value={p}>
              {PRIORITY_LABELS[p]}
            </option>
          ))}
        </select>

        {/* Assignee filter */}
        <select
          value={filters.assignee}
          onChange={(e) => setFilterAssignee(e.target.value)}
          style={selectStyle}
        >
          <option value="all">כל האנשים</option>
          {FAMILY_MEMBERS.map((member) => (
            <option key={member} value={member}>
              {member}
            </option>
          ))}
        </select>

        {/* Clear filters */}
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            style={{
              padding: '0.5rem 0.75rem',
              borderRadius: 'var(--border-radius-sm)',
              border: '1.5px solid var(--color-border)',
              background: 'transparent',
              color: 'var(--color-text-secondary)',
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--font-size-sm)',
              cursor: 'pointer',
            }}
          >
            ✕ נקה סינון
          </button>
        )}

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* Add task button */}
        <button
          onClick={onAddTask}
          style={{
            padding: '0.5rem 1.25rem',
            borderRadius: 'var(--border-radius-sm)',
            border: 'none',
            background: 'var(--color-primary)',
            color: '#fff',
            fontFamily: 'var(--font-body)',
            fontSize: 'var(--font-size-sm)',
            fontWeight: 'var(--font-weight-semibold)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            boxShadow: 'var(--shadow-sm)',
            transition: 'background var(--transition-fast)',
          }}
          onMouseOver={(e) => ((e.currentTarget as HTMLButtonElement).style.background = 'var(--color-primary-dark)')}
          onMouseOut={(e) => ((e.currentTarget as HTMLButtonElement).style.background = 'var(--color-primary)')}
        >
          + הוסף משימה
        </button>
      </div>
    </div>
  );
}
