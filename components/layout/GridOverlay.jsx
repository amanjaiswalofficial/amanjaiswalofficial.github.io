import React from 'react';

export function GridOverlay({ columns = 4, color = 'var(--ink)', opacity = 'var(--grid-opacity)', style }) {
  return (
    <div aria-hidden="true" style={{
      position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none', padding: '0 var(--gutter)',
      display: 'grid', gridTemplateColumns: `repeat(${columns}, minmax(0,1fr))`, color, opacity, transition: 'color var(--dur-ink)', ...style,
    }}>
      {Array.from({ length: columns }, (_, i) => (
        <div key={i} style={{ borderLeft: '1px solid currentColor', borderRight: i === columns - 1 ? '1px solid currentColor' : 0 }}></div>
      ))}
    </div>
  );
}
