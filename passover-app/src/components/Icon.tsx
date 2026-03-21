import type { CSSProperties } from 'react';

interface IconProps {
  name: string;
  filled?: boolean;
  size?: number;
  className?: string;
  style?: CSSProperties;
}

export function Icon({ name, filled = false, size = 24, className = '', style }: IconProps) {
  return (
    <span
      className={`material-symbols-outlined ${className}`}
      style={{
        fontSize: size,
        fontVariationSettings: `'FILL' ${filled ? 1 : 0}, 'wght' 400, 'GRAD' 0, 'opsz' ${size}`,
        userSelect: 'none',
        lineHeight: 1,
        ...style,
      }}
    >
      {name}
    </span>
  );
}
