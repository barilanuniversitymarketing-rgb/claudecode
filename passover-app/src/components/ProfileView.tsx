import { motion } from 'framer-motion';
import { useTaskStore } from '../store/useTaskStore';
import { MemberAvatar } from './MemberAvatar';
import { Icon } from './Icon';

export function ProfileView({ memberId }: { memberId: string }) {
  const { getMemberById, tasks, setView, familyMembers } = useTaskStore();
  const member = getMemberById(memberId);

  if (!member) return (
    <div className="flex items-center justify-center h-64" style={{ color: 'var(--color-on-surface-variant)' }}>
      חבר משפחה לא נמצא
    </div>
  );

  const memberTasks = tasks.filter(t => t.assigneeId === memberId);
  const doneTasks = memberTasks.filter(t => t.status === 'done');
  const inProgressTasks = memberTasks.filter(t => t.status === 'inprogress');
  const rank = [...familyMembers].sort((a, b) => b.points - a.points).findIndex(m => m.id === memberId) + 1;
  const earnedBadges = member.badges.filter(b => b.earned);
  const lockedBadges = member.badges.filter(b => !b.earned);
  const efficiency = memberTasks.length > 0 ? Math.round((doneTasks.length / memberTasks.length) * 100) : 0;

  return (
    <div className="max-w-2xl mx-auto px-6 py-8 pb-32 md:pb-12">
      {/* Back */}
      <button
        onClick={() => setView('management')}
        className="flex items-center gap-1 mb-8 transition-colors hover:text-primary"
        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-on-surface-variant)', fontFamily: 'var(--font-body)', fontSize: '0.875rem' }}
      >
        <Icon name="arrow_forward" size={18} />
        חזרה
      </button>

      {/* Hero */}
      <section className="flex flex-col items-center text-center mb-10">
        <div className="relative mb-6">
          <div className="absolute inset-0 rounded-full border-4 opacity-10 animate-pulse" style={{ borderColor: 'var(--color-primary)' }} />
          <MemberAvatar member={member} size={112} showBorder />
          {/* Points badge */}
          <div
            className="absolute px-4 py-1 rounded-full text-sm font-bold shadow-lg"
            style={{
              bottom: '-0.5rem',
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'var(--color-tertiary)',
              color: '#fff',
              whiteSpace: 'nowrap',
            }}
          >
            {member.points.toLocaleString()} נקודות
          </div>
        </div>
        <div className="pt-4">
          <h1 className="text-4xl font-bold mb-1" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-primary)' }}>
            {member.name}
          </h1>
          <p style={{ color: 'var(--color-secondary)', fontWeight: 500 }}>
            {member.role === 'leader' ? 'מנהל סדר' : 'משתתף'} • מקום {rank} בדירוג
          </p>
        </div>
      </section>

      {/* Stats bento */}
      <section className="grid grid-cols-2 gap-4 mb-10">
        <StatTile icon="task_alt" value={String(doneTasks.length)} label="משימות שהושלמו" iconColor="var(--color-primary)" />
        <StatTile icon="bolt" value={`${efficiency}%`} label="מדד יעילות" iconColor="var(--color-tertiary)" />
      </section>

      {/* Points progress card */}
      <div className="p-6 rounded-xl mb-10" style={{ background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-container))', color: '#fff' }}>
        <div className="flex justify-between items-start mb-4">
          <div>
            <p style={{ fontSize: '0.8rem', opacity: 0.8, fontFamily: 'var(--font-body)' }}>סה&quot;כ נקודות</p>
            <p className="text-3xl font-extrabold" style={{ fontFamily: 'var(--font-display)' }}>
              {member.points.toLocaleString()}
            </p>
          </div>
          <div className="p-3 rounded-full" style={{ background: 'rgba(255,255,255,0.2)' }}>
            <Icon name="military_tech" size={28} filled />
          </div>
        </div>
      </div>

      {/* Badges */}
      <section className="mb-10">
        <h2 className="text-xl font-bold mb-4" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-primary)' }}>
          תגים והישגים
        </h2>
        <div className="grid grid-cols-2 gap-4">
          {earnedBadges.map(badge => (
            <BadgeCard key={badge.id} badge={badge} earned />
          ))}
          {lockedBadges.map(badge => (
            <BadgeCard key={badge.id} badge={badge} earned={false} />
          ))}
        </div>
      </section>

      {/* In-progress tasks */}
      {inProgressTasks.length > 0 && (
        <section>
          <h2 className="text-xl font-bold mb-4" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-primary)' }}>
            משימות בתהליך
          </h2>
          <div className="space-y-3">
            {inProgressTasks.map(task => (
              <motion.div
                key={task.id}
                whileHover={{ scale: 0.99 }}
                className="p-4 rounded-xl flex items-center justify-between"
                style={{ background: 'var(--color-surface-container-lowest)', border: '1px solid var(--color-surface-container-high)' }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ background: 'rgba(0,68,132,0.08)', color: 'var(--color-primary)' }}
                  >
                    <Icon name="assignment" size={22} />
                  </div>
                  <div>
                    <p className="font-bold" style={{ color: 'var(--color-on-surface)', fontSize: '0.9rem' }}>{task.title}</p>
                    <p style={{ color: 'var(--color-secondary)', fontSize: '0.75rem' }}>
                      {task.progress !== undefined ? `${task.progress}% הושלם` : 'בתהליך'}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="text-sm font-bold" style={{ color: 'var(--color-primary)' }}>+{task.points}</span>
                  <div className="rounded-full overflow-hidden" style={{ width: '4rem', height: '4px', background: 'var(--color-surface-container)' }}>
                    <div style={{ width: `${task.progress ?? 0}%`, height: '100%', background: 'var(--color-primary)' }} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function StatTile({ icon, value, label, iconColor }: { icon: string; value: string; label: string; iconColor: string }) {
  return (
    <div
      className="p-5 rounded-xl flex flex-col items-center text-center"
      style={{ background: 'var(--color-surface-container-lowest)', border: '1px solid var(--color-surface-container-high)' }}
    >
      <Icon name={icon} size={30} filled className="mb-2" style={{ color: iconColor }} />
      <span className="text-2xl font-bold mb-1" style={{ color: iconColor, fontFamily: 'var(--font-display)' }}>{value}</span>
      <span style={{ color: 'var(--color-outline)', fontSize: '0.7rem', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        {label}
      </span>
    </div>
  );
}

function BadgeCard({ badge, earned }: { badge: import('../types').Badge; earned: boolean }) {
  const gradients = {
    haggadah: 'from-primary to-secondary-container',
    cleaning: 'from-tertiary to-tertiary-fixed-dim',
    early: 'from-primary-container to-primary-fixed-dim',
    helper: 'from-tertiary to-tertiary-fixed-dim',
    hametz: 'from-primary to-primary-container',
    chef: 'from-primary-container to-secondary-container',
  };
  const grad = gradients[badge.id as keyof typeof gradients] || 'from-primary to-primary-container';

  return (
    <div
      className={`p-5 rounded-2xl flex flex-col items-center text-center transition-all ${!earned ? 'opacity-60 grayscale' : ''}`}
      style={{
        background: 'var(--color-surface-container-lowest)',
        border: '1px solid var(--color-outline-variant)',
        opacity: earned ? 1 : 0.5,
      }}
    >
      <div
        className={`w-20 h-20 rounded-full flex items-center justify-center mb-3 relative bg-gradient-to-tr ${earned ? grad : ''}`}
        style={{ background: earned ? undefined : 'var(--color-surface-container-high)' }}
      >
        <Icon name={earned ? badge.icon : 'lock'} size={36} filled={earned} style={{ color: earned ? '#fff' : 'var(--color-outline)' }} />
        {earned && (
          <div
            className="absolute w-6 h-6 rounded-full flex items-center justify-center border-2 border-white"
            style={{ bottom: '-3px', insetInlineEnd: '-3px', background: 'var(--color-tertiary)', color: '#fff' }}
          >
            <Icon name="check" size={12} />
          </div>
        )}
      </div>
      <h3 className="font-bold mb-1" style={{ color: earned ? 'var(--color-primary)' : 'var(--color-outline)', fontSize: '0.85rem' }}>
        {badge.name}
      </h3>
      <p className="text-xs font-bold" style={{ color: earned ? 'var(--color-tertiary)' : 'var(--color-outline)' }}>
        {earned ? `+${badge.points} נקודות` : badge.description}
      </p>
      {!earned && (
        <div className="w-full rounded-full overflow-hidden mt-2" style={{ height: '4px', background: 'var(--color-surface-variant)' }}>
          <div className="h-full rounded-full" style={{ width: '25%', background: 'var(--color-outline)' }} />
        </div>
      )}
    </div>
  );
}
