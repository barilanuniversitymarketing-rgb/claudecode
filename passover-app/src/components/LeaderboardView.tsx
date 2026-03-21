import { motion } from 'framer-motion';
import { useTaskStore } from '../store/useTaskStore';
import { MemberAvatar } from './MemberAvatar';
import { Icon } from './Icon';

export function LeaderboardView() {
  const { getLeaderboard, setProfileMember, tasks } = useTaskStore();
  const members = getLeaderboard();
  const top3 = members.slice(0, 3);
  const rest = members.slice(3);
  const totalPoints = members.reduce((s, m) => s + m.points, 0);
  const totalDone = tasks.filter(t => t.status === 'done').length;

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-8 pb-32 md:pb-12">

      {/* Header */}
      <header className="mb-12 text-right">
        <div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4"
          style={{ background: 'rgba(0,68,132,0.06)', color: 'var(--color-primary)' }}
        >
          <Icon name="emoji_events" size={18} />
          <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.875rem', fontWeight: 600 }}>
            היכל התהילה המשפחתי
          </span>
        </div>
        <h1
          className="text-5xl font-bold tracking-tight mb-2"
          style={{ fontFamily: 'var(--font-display)', color: 'var(--color-primary)' }}
        >
          מי ידע 13?
        </h1>
        <p style={{ color: 'var(--color-on-surface-variant)', fontSize: '1.1rem' }}>
          מעקב התקדמות ומשימות לקראת ליל הסדר
        </p>
      </header>

      {/* Podium */}
      {top3.length >= 3 && (
        <div className="grid grid-cols-3 gap-6 items-end mb-16">
          {/* 2nd place */}
          <PodiumCard member={top3[1]} place={2} onViewProfile={setProfileMember} />
          {/* 1st place */}
          <PodiumCard member={top3[0]} place={1} onViewProfile={setProfileMember} />
          {/* 3rd place */}
          <PodiumCard member={top3[2]} place={3} onViewProfile={setProfileMember} />
        </div>
      )}

      {/* Full rankings */}
      <div
        className="rounded-3xl p-6 mb-10"
        style={{ background: 'var(--color-surface-container-lowest)', border: '1px solid var(--color-surface-container-high)' }}
      >
        <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-primary)' }}>
          דירוג מלא
        </h2>
        <div className="space-y-4">
          {rest.map((member, i) => {
            const pct = members[0].points > 0 ? (member.points / members[0].points) * 100 : 0;
            return (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
                className="flex items-center gap-4 cursor-pointer hover:bg-surface-container rounded-xl px-3 py-2 transition-colors"
                onClick={() => setProfileMember(member.id)}
              >
                <span style={{ color: '#c2c6d3', fontWeight: 700, fontSize: '1.1rem', width: '1.5rem', textAlign: 'center' }}>
                  {i + 4}
                </span>
                <MemberAvatar member={member} size={44} />
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="font-semibold" style={{ color: 'var(--color-primary)' }}>{member.name}</span>
                    <span className="text-sm font-bold" style={{ color: 'var(--color-on-surface-variant)' }}>
                      {member.points.toLocaleString()} נק׳
                    </span>
                  </div>
                  <div className="rounded-full overflow-hidden" style={{ height: '6px', background: 'var(--color-surface-container)' }}>
                    <div className="h-full rounded-full" style={{ width: `${pct}%`, background: 'var(--color-primary-container)' }} />
                  </div>
                </div>
                <Icon name="chevron_left" size={18} style={{ color: 'var(--color-on-surface-variant)' }} />
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Group CTA */}
        <div
          className="p-8 rounded-3xl flex items-center justify-between"
          style={{ background: 'var(--color-tertiary)', color: '#fff' }}
        >
          <div>
            <h4 className="text-xl font-bold mb-2" style={{ fontFamily: 'var(--font-display)' }}>
              משימת היום הקבוצתית
            </h4>
            <p className="mb-4" style={{ color: 'var(--color-tertiary-fixed)', opacity: 0.9, fontSize: '0.9rem' }}>
              {totalDone} משימות הושלמו יחד!
            </p>
            <div className="flex -space-x-3 space-x-reverse">
              {members.slice(0, 4).map(m => (
                <MemberAvatar key={m.id} member={m} size={38} showBorder />
              ))}
              {members.length > 4 && (
                <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold border-2 border-white">
                  +{members.length - 4}
                </div>
              )}
            </div>
          </div>
          <Icon name="groups" size={72} className="opacity-20" />
        </div>

        {/* Family record */}
        <div
          className="p-8 rounded-3xl flex items-center justify-between"
          style={{ background: 'var(--color-secondary-container)', color: 'var(--color-on-secondary-container)' }}
        >
          <div>
            <h4 className="text-xl font-bold mb-2" style={{ fontFamily: 'var(--font-display)' }}>שיא משפחתי</h4>
            <p className="mb-1">
              צברנו ביחד <strong>{totalPoints.toLocaleString()}</strong> נקודות!
            </p>
            <p style={{ fontSize: '0.85rem', opacity: 0.7 }}>{members.length} חברי משפחה</p>
          </div>
          <Icon name="celebration" size={72} className="opacity-20" />
        </div>
      </div>
    </div>
  );
}

function PodiumCard({
  member, place, onViewProfile,
}: {
  member: import('../types').FamilyMember;
  place: 1 | 2 | 3;
  onViewProfile: (id: string) => void;
}) {
  const medalColors = { 1: 'var(--color-primary)', 2: '#94a3b8', 3: '#f97316' };
  const bgColors = { 1: 'var(--color-primary)', 2: 'var(--color-surface-container-low)', 3: 'var(--color-surface-container-low)' };
  const textColors = { 1: '#fff', 2: 'var(--color-primary)', 3: 'var(--color-primary)' };
  const h = { 1: '12rem', 2: '9rem', 3: '8rem' };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: (3 - place) * 0.1 }}
      className="flex flex-col items-center cursor-pointer"
      onClick={() => onViewProfile(member.id)}
    >
      {/* Avatar */}
      <div className="relative mb-4">
        {place === 1 && (
          <Icon
            name="workspace_premium"
            size={44}
            filled
            className="absolute"
            style={{ top: '-2.5rem', left: '50%', transform: 'translateX(-50%)', color: 'var(--color-tertiary)' }}
          />
        )}
        <MemberAvatar
          member={member}
          size={place === 1 ? 80 : 60}
          showBorder
        />
        <div
          className="absolute font-bold border-2 border-white rounded-full flex items-center justify-center"
          style={{
            width: place === 1 ? '2.5rem' : '2rem',
            height: place === 1 ? '2.5rem' : '2rem',
            bottom: '-0.5rem', insetInlineEnd: '-0.5rem',
            background: medalColors[place],
            color: '#fff',
            fontSize: place === 1 ? '1rem' : '0.875rem',
            fontWeight: 700,
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          }}
        >
          {place}
        </div>
      </div>

      {/* Podium block */}
      <div
        className="w-full rounded-t-3xl text-center pt-6 pb-6 px-4 relative overflow-hidden"
        style={{
          height: h[place],
          background: bgColors[place],
          color: textColors[place],
        }}
      >
        <h3 className="font-bold text-lg mb-1" style={{ fontFamily: 'var(--font-display)' }}>
          {member.name.split(' ')[0]}
        </h3>
        <p className="font-bold" style={{ color: place === 1 ? 'var(--color-primary-fixed-dim)' : 'var(--color-tertiary)', fontSize: '0.95rem' }}>
          {member.points.toLocaleString()} נק׳
        </p>
      </div>
    </motion.div>
  );
}
