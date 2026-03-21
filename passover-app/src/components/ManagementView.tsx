import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTaskStore } from '../store/useTaskStore';
import { MemberAvatar } from './MemberAvatar';
import { Icon } from './Icon';
import { AddMemberModal } from './AddMemberModal';
import type { Task } from '../types';

const STATUS_CHIP: Record<string, { bg: string; dot: string; color: string; label: string }> = {
  done:       { bg: '#dcfce7', dot: '#22c55e', color: '#16a34a', label: 'הושלם' },
  inprogress: { bg: '#fef9c3', dot: '#eab308', color: '#ca8a04', label: 'בתהליך' },
  todo:       { bg: 'var(--color-surface-container)', dot: '#94a3b8', color: 'var(--color-on-surface-variant)', label: 'טרם החל' },
};

export function ManagementView({ onEditTask }: { onEditTask: (t: Task) => void }) {
  const { familyMembers, tasks, deleteTask, setProfileMember } = useTaskStore();
  const [addMemberOpen, setAddMemberOpen] = useState(false);

  const totalDone = tasks.filter(t => t.status === 'done').length;
  const daysLeft = Math.max(0, Math.ceil((new Date('2026-04-13').getTime() - Date.now()) / 86400000));
  const readiness = tasks.length > 0 ? Math.round((totalDone / tasks.length) * 100) : 0;

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-8 pb-32 md:pb-12">

      {/* Header */}
      <header className="mb-12 flex flex-col md:flex-row-reverse justify-between items-end gap-6">
        <div className="text-right">
          <h1 className="text-4xl font-bold tracking-tight mb-2" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-primary)' }}>
            ניהול מערך הפסח
          </h1>
          <p style={{ color: 'var(--color-on-surface-variant)', fontSize: '1.05rem' }}>
            מרכז השליטה של משפחת גוטין
          </p>
        </div>
        <button
          onClick={() => setAddMemberOpen(true)}
          className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all hover:opacity-90 active:scale-95"
          style={{
            background: 'var(--color-primary)', color: '#fff',
            fontFamily: 'var(--font-body)', border: 'none', cursor: 'pointer',
            boxShadow: '0 4px 16px rgba(0,68,132,0.2)',
          }}
        >
          <Icon name="person_add" size={18} />
          הוספת בן משפחה
        </button>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-5 mb-12">
        <StatCard
          icon="inventory_2" bg="var(--color-primary)"
          value={`${totalDone}/${tasks.length}`} label="משימות שהושלמו" lightText
        />
        <StatCard
          icon="timer" bg="var(--color-surface-container-lowest)"
          value={String(daysLeft)} label="ימים לליל הסדר"
          border
        />
        <StatCard
          icon="celebration" bg="var(--color-tertiary)"
          value={`${readiness}%`} label="רמת מוכנות" lightText
        />
      </div>

      {/* Members section */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-primary)' }}>
            ניהול משתתפים
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {familyMembers.map(member => (
            <motion.div
              key={member.id}
              whileHover={{ y: -2, boxShadow: '0 8px 24px rgba(0,27,60,0.1)' }}
              onClick={() => setProfileMember(member.id)}
              className="p-6 rounded-xl cursor-pointer transition-shadow"
              style={{
                background: 'var(--color-surface-container-lowest)',
                border: '1px solid var(--color-surface-container-high)',
              }}
            >
              <div className="flex items-start justify-between mb-4">
                <MemberAvatar member={member} size={60} />
                <span
                  className="text-xs font-bold px-3 py-1 rounded-full"
                  style={{
                    background: member.role === 'leader' ? 'rgba(137,0,69,0.1)' : 'rgba(0,68,132,0.1)',
                    color: member.role === 'leader' ? 'var(--color-tertiary)' : 'var(--color-primary)',
                  }}
                >
                  {member.role === 'leader' ? 'מנהל סדר' : 'משתתף'}
                </span>
              </div>
              <h3 className="text-lg font-bold mb-1" style={{ color: 'var(--color-primary)', fontFamily: 'var(--font-body)' }}>
                {member.name}
              </h3>
              <p style={{ color: 'var(--color-on-surface-variant)', fontSize: '0.8rem', marginBottom: '0.75rem' }}>
                {tasks.filter(t => t.assigneeId === member.id && t.status === 'done').length} משימות הושלמו
              </p>
              <div className="flex items-center gap-1" style={{ color: 'var(--color-primary)' }}>
                <Icon name="star" size={15} filled />
                <span style={{ fontWeight: 700, fontSize: '0.875rem' }}>{member.points.toLocaleString()} נקודות</span>
              </div>
            </motion.div>
          ))}

          {/* Add member slot */}
          <motion.div
            whileHover={{ borderColor: 'var(--color-primary)' }}
            onClick={() => setAddMemberOpen(true)}
            className="p-6 rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all"
            style={{
              border: '2px dashed var(--color-outline-variant)',
              color: 'var(--color-outline)',
              background: 'rgba(255,255,255,0.3)',
            }}
          >
            <Icon name="person_add" size={36} />
            <span className="mt-2 font-semibold text-sm" style={{ fontFamily: 'var(--font-body)' }}>הוספת בן משפחה</span>
          </motion.div>
        </div>
      </section>

      {/* Task table */}
      <section>
        <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-primary)' }}>
          טבלת משימות פסח
        </h2>
        <div
          className="rounded-2xl overflow-hidden"
          style={{ border: '1px solid var(--color-surface-container-high)', background: 'var(--color-surface-container-lowest)' }}
        >
          <div className="overflow-x-auto">
            <table className="w-full border-collapse" style={{ textAlign: 'right' }}>
              <thead>
                <tr style={{ background: 'var(--color-surface-container-low)', color: 'var(--color-on-surface-variant)', fontFamily: 'var(--font-body)', fontWeight: 600 }}>
                  {['שם חבר המשפחה', 'כותרת המשימה', 'ניקוד', 'סטטוס', 'תאריך יעד', 'פעולות'].map(h => (
                    <th key={h} className="px-5 py-4" style={{ fontWeight: 600, fontSize: '0.875rem' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody style={{ fontFamily: 'var(--font-body)' }}>
                {tasks.slice(0, 20).map(task => {
                  const member = task.assigneeId ? familyMembers.find(m => m.id === task.assigneeId) : null;
                  const s = STATUS_CHIP[task.status];
                  return (
                    <tr
                      key={task.id}
                      className="hover:bg-surface-container-low/50 transition-colors"
                      style={{ borderTop: '1px solid var(--color-surface-container)' }}
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          {member ? <MemberAvatar member={member} size={30} /> : <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center"><Icon name="person" size={16} /></div>}
                          <span style={{ fontWeight: 500, fontSize: '0.875rem' }}>{member?.name ?? '—'}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4" style={{ fontSize: '0.875rem', maxWidth: '240px' }}>
                        <span style={{ fontWeight: task.status === 'done' ? 400 : 500, textDecoration: task.status === 'done' ? 'line-through' : 'none', color: task.status === 'done' ? 'var(--color-on-surface-variant)' : 'inherit' }}>
                          {task.title}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-center">
                        <span
                          className="px-3 py-1 rounded-full text-sm font-bold"
                          style={{ background: 'rgba(0,68,132,0.06)', color: 'var(--color-primary)' }}
                        >
                          {task.points}+
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold" style={{ background: s.bg, color: s.color }}>
                          <span className="w-1.5 h-1.5 rounded-full" style={{ background: s.dot }} />
                          {s.label}
                        </span>
                      </td>
                      <td className="px-5 py-4" style={{ color: 'var(--color-on-surface-variant)', fontSize: '0.8rem' }}>
                        {task.dueDate ? new Date(task.dueDate).toLocaleDateString('he-IL') : '—'}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => onEditTask(task)}
                            className="p-1 rounded hover:bg-surface-container transition-colors"
                            style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--color-outline)' }}
                          >
                            <Icon name="edit" size={16} />
                          </button>
                          <button
                            onClick={() => deleteTask(task.id)}
                            className="p-1 rounded hover:bg-surface-container transition-colors"
                            style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--color-error)' }}
                          >
                            <Icon name="delete" size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {addMemberOpen && <AddMemberModal onClose={() => setAddMemberOpen(false)} />}
    </div>
  );
}

function StatCard({ icon, bg, value, label, lightText, border }: {
  icon: string; bg: string; value: string; label: string; lightText?: boolean; border?: boolean;
}) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="p-8 rounded-2xl flex flex-col justify-between relative overflow-hidden"
      style={{ background: bg, minHeight: '140px', border: border ? '1px solid var(--color-surface-container-high)' : undefined }}
    >
      <Icon
        name={icon}
        size={90}
        className="absolute opacity-10"
        style={{ bottom: '-1rem', insetInlineEnd: '-1rem', color: lightText ? '#fff' : 'var(--color-primary)' }}
      />
      <span style={{ fontSize: '0.8rem', fontWeight: 600, opacity: 0.8, color: lightText ? '#fff' : 'var(--color-on-surface-variant)', fontFamily: 'var(--font-body)' }}>
        {label}
      </span>
      <div className="text-5xl font-bold" style={{ fontFamily: 'var(--font-display)', color: lightText ? '#fff' : 'var(--color-primary)', marginTop: 'auto' }}>
        {value}
      </div>
    </motion.div>
  );
}
