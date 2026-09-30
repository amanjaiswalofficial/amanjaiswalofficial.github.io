import React from 'react';

export function Eyebrow({ left, right, style }) {
  return (
    <div data-r="" style={{
      display: 'flex', justifyContent: 'space-between', gap: 12,
      fontFamily: 'var(--font-mono)', fontSize: 'var(--text-meta)', textTransform: 'uppercase',
      letterSpacing: 'var(--tracking-meta)', ...style,
    }}>
      <span>{left}</span>{right != null && <span>{right}</span>}
    </div>
  );
}
