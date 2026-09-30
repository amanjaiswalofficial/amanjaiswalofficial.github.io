import React from 'react';
import { SquareButton } from '../actions/SquareButton';

export function DeckFooter({ hint = 'Swipe →', hintVisible = true, onPrev, onNext, color = 'var(--ink)', style }) {
  return (
    <footer style={{ position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 5, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 var(--gutter) 16px', color, transition: 'color var(--dur-ink)', pointerEvents: 'none', ...style }}>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-meta)', textTransform: 'uppercase', letterSpacing: 'var(--tracking-meta)', opacity: hintVisible ? 1 : 0, transform: hintVisible ? 'none' : 'translateX(12px)', transition: 'opacity .5s, transform .5s' }}>{hint}</span>
      <div style={{ display: 'flex', gap: 'var(--space-3)', pointerEvents: 'auto' }}>
        <SquareButton label="Previous" onClick={onPrev}>←</SquareButton>
        <SquareButton label="Next" onClick={onNext}>→</SquareButton>
      </div>
    </footer>
  );
}
