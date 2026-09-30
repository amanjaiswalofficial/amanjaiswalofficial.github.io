import React from 'react';
import { SegmentedProgress } from './SegmentedProgress';

export function Masthead({ name, pageName, index = 0, total, progress, labels, onSelect, color = 'var(--ink)', style }) {
  const pad = n => String(n).padStart(2, '0');
  return (
    <header style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 5, padding: '10px var(--gutter) 0', color, transition: 'color var(--dur-ink)', pointerEvents: 'none', ...style }}>
      <div style={{ pointerEvents: 'auto' }}>
        <SegmentedProgress count={total} progress={progress ?? index} onSelect={onSelect} labels={labels} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', marginTop: 4, fontFamily: 'var(--font-mono)', fontSize: 'var(--text-meta)', textTransform: 'uppercase', letterSpacing: 'var(--tracking-meta)' }}>
        <span>{name}</span>
        <span>{pageName}</span>
        <span style={{ textAlign: 'right' }}>{pad(index + 1)} / {pad(total)}</span>
      </div>
    </header>
  );
}
