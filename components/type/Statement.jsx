import React from 'react';

const SIZES = {
  statement: { fontSize: 'var(--text-statement)', fontWeight: 500, fontStretch: '92%', lineHeight: 1.04, letterSpacing: '-.025em', maxWidth: '16ch' },
  body:      { fontSize: 'var(--text-body)', fontWeight: 400, lineHeight: 'var(--leading-body)', maxWidth: '32ch' },
  meta:      { fontFamily: 'var(--font-mono)', fontSize: 'var(--text-meta)', textTransform: 'uppercase', letterSpacing: 'var(--tracking-meta)' },
};

export function Statement({ children, size = 'statement', style }) {
  return <p data-r="" style={{ margin: 0, textWrap: 'pretty', ...SIZES[size], ...style }}>{children}</p>;
}
