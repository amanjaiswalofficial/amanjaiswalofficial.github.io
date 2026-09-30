import React from 'react';

export function SegmentedProgress({ count, progress = 0, onSelect, labels = [] }) {
  return (
    <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
      {Array.from({ length: count }, (_, i) => (
        <button key={i} onClick={() => onSelect && onSelect(i)} aria-label={'Go to ' + (labels[i] || i + 1)}
          style={{ flex: 1, height: 22, padding: 0, margin: 0, border: 0, background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', color: 'inherit' }}>
          <span style={{ position: 'relative', display: 'block', width: '100%', height: 2, overflow: 'hidden' }}>
            <span style={{ position: 'absolute', inset: 0, background: 'currentColor', opacity: 'var(--track-opacity)' }}></span>
            <span data-fill="" style={{ position: 'absolute', inset: 0, background: 'currentColor', transformOrigin: '0 50%', transform: `scaleX(${Math.max(0, Math.min(1, progress - i + 1))})` }}></span>
          </span>
        </button>
      ))}
    </div>
  );
}
