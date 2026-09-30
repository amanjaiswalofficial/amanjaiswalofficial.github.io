import React from 'react';

export function TextButton({ children, onClick, style }) {
  return (
    <button data-r="" onClick={onClick} style={{
      alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: 10, minHeight: 'var(--hit)',
      padding: 0, border: 0, background: 'transparent', color: 'inherit', cursor: 'pointer',
      fontFamily: 'var(--font-mono)', fontSize: 'var(--text-meta)', textTransform: 'uppercase', letterSpacing: 'var(--tracking-meta)', ...style,
    }}>{children}</button>
  );
}
