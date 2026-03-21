import { motion } from 'framer-motion';
import { useTaskStore } from '../store/useTaskStore';

export function Header() {
  const { activeView, setView, tasks } = useTaskStore();

  const totalDone = tasks.filter((t) => t.status === 'done').length;
  const totalTasks = tasks.length;
  const progress = totalTasks > 0 ? Math.round((totalDone / totalTasks) * 100) : 0;

  return (
    <header
      className="app-header"
      style={{
        background: 'linear-gradient(135deg, var(--color-primary-dark) 0%, var(--color-primary) 60%, var(--color-primary-light) 100%)',
        color: '#fff',
        padding: 'var(--spacing-lg) var(--spacing-xl)',
        boxShadow: '0 4px 20px rgba(44,24,16,0.2)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}
    >
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Title row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 'var(--spacing-md)',
          }}
        >
          <div>
            <motion.h1
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'var(--font-size-3xl)',
                fontWeight: 'var(--font-weight-bold)',
                margin: 0,
                letterSpacing: '0.02em',
                textShadow: '0 2px 6px rgba(0,0,0,0.2)',
              }}
            >
              🕍 פסח תשפ"ו — משפחת גוטין
            </motion.h1>
            <p
              style={{
                margin: 'var(--spacing-xs) 0 0',
                opacity: 0.85,
                fontFamily: 'var(--font-body)',
                fontSize: 'var(--font-size-sm)',
              }}
            >
              ניהול משימות לקראת החג הגדול
            </p>
          </div>

          {/* View toggle */}
          <div
            style={{
              display: 'flex',
              background: 'rgba(255,255,255,0.15)',
              borderRadius: 'var(--border-radius-full)',
              padding: '3px',
              gap: '2px',
            }}
          >
            <button
              onClick={() => setView('kanban')}
              style={{
                padding: '0.4rem 1rem',
                borderRadius: 'var(--border-radius-full)',
                border: 'none',
                cursor: 'pointer',
                fontFamily: 'var(--font-body)',
                fontSize: 'var(--font-size-sm)',
                fontWeight: activeView === 'kanban' ? 'var(--font-weight-semibold)' : 'var(--font-weight-normal)',
                background: activeView === 'kanban' ? '#fff' : 'transparent',
                color: activeView === 'kanban' ? 'var(--color-primary)' : '#fff',
                transition: 'all var(--transition-base)',
              }}
            >
              📋 לוח קנבן
            </button>
            <button
              onClick={() => setView('list')}
              style={{
                padding: '0.4rem 1rem',
                borderRadius: 'var(--border-radius-full)',
                border: 'none',
                cursor: 'pointer',
                fontFamily: 'var(--font-body)',
                fontSize: 'var(--font-size-sm)',
                fontWeight: activeView === 'list' ? 'var(--font-weight-semibold)' : 'var(--font-weight-normal)',
                background: activeView === 'list' ? '#fff' : 'transparent',
                color: activeView === 'list' ? 'var(--color-primary)' : '#fff',
                transition: 'all var(--transition-base)',
              }}
            >
              📝 רשימה
            </button>
          </div>
        </div>

        {/* Progress bar */}
        <div style={{ marginTop: 'var(--spacing-md)' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: 'var(--spacing-xs)',
              fontSize: 'var(--font-size-sm)',
              opacity: 0.9,
            }}
          >
            <span>{totalDone} מתוך {totalTasks} משימות הושלמו</span>
            <span>{progress}%</span>
          </div>
          <div
            style={{
              height: '8px',
              background: 'rgba(255,255,255,0.25)',
              borderRadius: 'var(--border-radius-full)',
              overflow: 'hidden',
            }}
          >
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              style={{
                height: '100%',
                background: 'linear-gradient(90deg, var(--color-accent-light), var(--color-accent))',
                borderRadius: 'var(--border-radius-full)',
              }}
            />
          </div>
        </div>
      </div>
    </header>
  );
}
