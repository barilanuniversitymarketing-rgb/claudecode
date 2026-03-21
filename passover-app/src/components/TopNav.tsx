import { useTaskStore } from '../store/useTaskStore';
import { MemberAvatar } from './MemberAvatar';

export function TopNav() {
  const { activeView, setView, familyMembers, currentMemberId, tasks, setProfileMember } = useTaskStore();
  const currentMember = familyMembers.find(m => m.id === currentMemberId);
  const totalDone = tasks.filter(t => t.status === 'done').length;
  const totalTasks = tasks.length;
  const progress = totalTasks > 0 ? Math.round((totalDone / totalTasks) * 100) : 0;
  const daysLeft = Math.max(0, Math.ceil((new Date('2026-04-13').getTime() - Date.now()) / 86400000));

  const navItems = [
    { id: 'dashboard' as const, label: 'לוח משימות' },
    { id: 'management' as const, label: 'ניהול' },
    { id: 'leaderboard' as const, label: 'טבלת מובילים' },
  ];

  return (
    <header
      className="fixed top-0 w-full z-50 glass-nav shadow-sm"
      style={{ borderBottom: '1px solid rgba(194,198,211,0.2)' }}
    >
      <div className="flex flex-row-reverse justify-between items-center px-8 h-16 max-w-[1600px] mx-auto">
        {/* Logo / Title */}
        <div className="flex items-center gap-3">
          <span className="text-xl font-bold text-primary" style={{ fontFamily: 'var(--font-display)' }}>
            פסח תשפ&quot;ו - משפחת גוטין
          </span>
          <span className="text-lg">🍷</span>
        </div>

        {/* Desktop nav links */}
        <nav className="hidden md:flex flex-row-reverse items-center gap-8 h-full">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className="relative pb-1 transition-colors"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '0.95rem',
                color: activeView === item.id ? 'var(--color-primary)' : 'var(--color-on-surface-variant)',
                fontWeight: activeView === item.id ? 700 : 400,
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                borderBottom: activeView === item.id ? '2px solid var(--color-tertiary)' : '2px solid transparent',
              }}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Right side: progress badge + avatar */}
        <div className="flex items-center gap-4">
          <div
            className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full"
            style={{ background: 'var(--color-primary-fixed)', color: 'var(--color-primary)' }}
          >
            <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', fontWeight: 600 }}>
              {progress}% הושלם
            </span>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: 'var(--color-tertiary)', fontWeight: 700 }}>
              · {daysLeft} ימים לחג
            </span>
          </div>

          {currentMember && (
            <button
              onClick={() => setProfileMember(currentMemberId)}
              className="rounded-full overflow-hidden border-2 transition-transform hover:scale-105 active:scale-95"
              style={{ borderColor: 'var(--color-primary)', padding: 0, background: 'none', cursor: 'pointer' }}
            >
              <MemberAvatar member={currentMember} size={38} />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
