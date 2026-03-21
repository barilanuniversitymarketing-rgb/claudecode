import { Icon } from './Icon';
import { useTaskStore } from '../store/useTaskStore';
import type { AppView } from '../types';

const NAV_ITEMS: { id: AppView; label: string; icon: string }[] = [
  { id: 'dashboard', label: 'לוח', icon: 'dashboard' },
  { id: 'management', label: 'ניהול', icon: 'settings' },
  { id: 'leaderboard', label: 'מובילים', icon: 'leaderboard' },
  { id: 'profile', label: 'פרופיל', icon: 'person' },
];

export function BottomNav() {
  const { activeView, setView, setProfileMember, currentMemberId } = useTaskStore();

  function handleNav(id: AppView) {
    if (id === 'profile') {
      setProfileMember(currentMemberId);
    } else {
      setView(id);
    }
  }

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 w-full z-50 flex flex-row-reverse justify-around items-center px-6 pb-6 pt-3 rounded-t-3xl"
      style={{
        background: 'rgba(255,255,255,0.85)',
        backdropFilter: 'blur(20px)',
        boxShadow: '0 -4px 24px -4px rgba(0,27,60,0.06)',
      }}
    >
      {NAV_ITEMS.map(item => {
        const isActive = activeView === item.id;
        return (
          <button
            key={item.id}
            onClick={() => handleNav(item.id)}
            className="flex flex-col items-center justify-center transition-all active:scale-90"
            style={{
              background: isActive ? 'rgba(0,68,132,0.08)' : 'transparent',
              color: isActive ? 'var(--color-primary)' : '#94a3b8',
              borderRadius: '0.75rem',
              padding: '0.25rem 1rem',
              border: 'none',
              cursor: 'pointer',
              fontFamily: 'var(--font-body)',
            }}
          >
            <Icon name={item.icon} filled={isActive} size={22} />
            <span style={{ fontSize: '0.625rem', marginTop: '0.2rem', fontWeight: isActive ? 600 : 400 }}>
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
