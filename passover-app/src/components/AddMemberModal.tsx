import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTaskStore } from '../store/useTaskStore';
import { MEMBER_COLORS } from '../types';
import { Icon } from './Icon';

interface AddMemberModalProps {
  onClose: () => void;
}

export function AddMemberModal({ onClose }: AddMemberModalProps) {
  const { addFamilyMember } = useTaskStore();
  const [name, setName] = useState('');
  const [color, setColor] = useState(MEMBER_COLORS[0]);
  const [role, setRole] = useState<'participant' | 'leader'>('participant');
  const [error, setError] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) { setError('שם נדרש'); return; }
    addFamilyMember({ name: name.trim(), color, role });
    onClose();
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', height: '56px', padding: '0 1.25rem',
    background: 'var(--color-surface-container-high)',
    border: 'none', borderRadius: '0.75rem',
    color: 'var(--color-on-surface)', fontFamily: 'var(--font-body)',
    fontSize: '1rem', outline: 'none', boxSizing: 'border-box',
  };

  return (
    <AnimatePresence>
      <motion.div
        key="overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-[300] flex items-center justify-center p-4"
        style={{ background: 'rgba(25,28,30,0.5)', backdropFilter: 'blur(4px)' }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', stiffness: 350, damping: 28 }}
          onClick={e => e.stopPropagation()}
          className="rounded-xl overflow-hidden"
          style={{
            background: 'var(--color-surface-container-lowest)',
            boxShadow: '0 20px 60px rgba(25,28,30,0.25)',
            width: '100%', maxWidth: '480px',
          }}
        >
          <div className="p-10 flex flex-col items-center">
            {/* Title */}
            <h1 className="text-3xl font-bold mb-10 tracking-wide" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-primary)' }}>
              הוספת בן משפחה
            </h1>

            {/* Avatar preview */}
            <div className="relative group mb-10">
              <div
                className="w-32 h-32 rounded-full flex items-center justify-center text-white text-4xl font-bold shadow-lg"
                style={{ background: color }}
              >
                {name.trim()[0] ?? '?'}
              </div>
              <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full flex items-center justify-center shadow-lg" style={{ background: 'var(--color-primary)', color: '#fff' }}>
                <Icon name="add" size={20} />
              </div>
            </div>

            <form onSubmit={handleSubmit} className="w-full flex flex-col gap-6">
              {/* Name */}
              <div>
                <label
                  className="block text-sm font-semibold mb-2 ps-1"
                  style={{ color: 'var(--color-on-surface-variant)', fontFamily: 'var(--font-body)' }}
                >
                  שם בן המשפחה
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={e => { setName(e.target.value); setError(''); }}
                  placeholder="למשל: דניאלה"
                  style={inputStyle}
                  autoFocus
                />
                {error && <p style={{ color: 'var(--color-error)', fontSize: '0.75rem', marginTop: '0.25rem' }}>{error}</p>}
              </div>

              {/* Role */}
              <div>
                <label className="block text-sm font-semibold mb-2 ps-1" style={{ color: 'var(--color-on-surface-variant)', fontFamily: 'var(--font-body)' }}>
                  תפקיד בסדר
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {(['participant', 'leader'] as const).map(r => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRole(r)}
                      className="flex items-center justify-center gap-2 p-3 rounded-xl transition-all"
                      style={{
                        border: role === r ? '2px solid var(--color-primary)' : '2px solid transparent',
                        background: role === r ? 'rgba(0,68,132,0.06)' : 'var(--color-surface-container-high)',
                        color: role === r ? 'var(--color-primary)' : 'var(--color-on-surface-variant)',
                        fontFamily: 'var(--font-body)', fontWeight: role === r ? 700 : 400, cursor: 'pointer',
                      }}
                    >
                      <Icon name={r === 'leader' ? 'stars' : 'person'} size={18} />
                      {r === 'leader' ? 'מנהל סדר' : 'משתתף'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color picker */}
              <div>
                <label className="block text-sm font-semibold mb-3 ps-1" style={{ color: 'var(--color-on-surface-variant)', fontFamily: 'var(--font-body)' }}>
                  צבע נושא אישי
                </label>
                <div className="flex flex-wrap justify-between gap-2">
                  {MEMBER_COLORS.map(c => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setColor(c)}
                      className="rounded-full transition-all hover:scale-110"
                      style={{
                        width: '2rem', height: '2rem', background: c,
                        border: 'none', cursor: 'pointer',
                        outline: color === c ? `3px solid ${c}` : 'none',
                        outlineOffset: '2px',
                        transform: color === c ? 'scale(1.15)' : undefined,
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-3 mt-4">
                <button
                  type="submit"
                  className="w-full py-4 rounded-xl font-bold text-lg transition-all active:scale-95"
                  style={{
                    background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-container))',
                    color: '#fff', border: 'none', cursor: 'pointer',
                    fontFamily: 'var(--font-body)',
                    boxShadow: '0 4px 12px rgba(0,68,132,0.2)',
                  }}
                >
                  הוספת חבר
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full py-3 rounded-xl font-semibold transition-colors"
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-secondary)', fontFamily: 'var(--font-body)' }}
                >
                  ביטול
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
