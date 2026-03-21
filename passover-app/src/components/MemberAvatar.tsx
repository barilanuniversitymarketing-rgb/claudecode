import type { FamilyMember } from '../types';

interface MemberAvatarProps {
  member: FamilyMember;
  size?: number;
  showBorder?: boolean;
  className?: string;
}

export function MemberAvatar({ member, size = 40, showBorder = false, className = '' }: MemberAvatarProps) {
  const initials = member.name
    .split(' ')
    .map(w => w[0])
    .slice(0, 2)
    .join('');

  return (
    <div
      className={className}
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: member.color,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        fontFamily: 'var(--font-body)',
        fontWeight: 700,
        fontSize: size * 0.35,
        flexShrink: 0,
        border: showBorder ? '3px solid #fff' : undefined,
        boxShadow: showBorder ? '0 0 0 2px rgba(0,0,0,0.1)' : undefined,
        userSelect: 'none',
      }}
    >
      {initials}
    </div>
  );
}
