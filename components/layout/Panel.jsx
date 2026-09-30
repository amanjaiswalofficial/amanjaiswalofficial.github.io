import React from 'react';

export function Panel({ children, color = 'var(--ink)', gap = 'var(--space-6)', label, style }) {
  return (
    <section data-screen-label={label} style={{
      height: '100%', boxSizing: 'border-box', position: 'relative', overflowY: 'auto', scrollbarWidth: 'none',
      padding: 'var(--pad-top) var(--gutter) var(--pad-bottom)', display: 'flex', flexDirection: 'column',
      color, fontFamily: 'var(--font-sans)', ...style,
    }}>
      <div data-content="" style={{ marginTop: 'auto', width: '100%', maxWidth: 'var(--col-max)', display: 'flex', flexDirection: 'column', gap }}>
        {children}
      </div>
    </section>
  );
}
