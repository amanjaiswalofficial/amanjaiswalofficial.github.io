import React from 'react';

const mono = { fontFamily: 'var(--font-mono)', fontSize: 'var(--text-meta)', textTransform: 'uppercase', letterSpacing: 'var(--tracking-meta-tight)' };

export function IndexLinkRow({ number, title, meta, href, style }) {
  const [h, setH] = React.useState(false);
  return (
    <a data-r="" href={href} target="_blank" rel="noopener" draggable={false}
      onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{
        display: 'grid', gridTemplateColumns: number != null ? '32px minmax(0,1fr) auto' : 'minmax(0,1fr) auto',
        alignItems: 'center', columnGap: 'var(--space-5)', minHeight: 'var(--row-h)',
        borderTop: 'var(--hairline) solid var(--row-rule, currentColor)', color: 'inherit', textDecoration: 'none',
        paddingLeft: h ? 'var(--space-4)' : 0, transition: 'padding var(--dur-hover) var(--ease-hover)', ...style,
      }}>
      {number != null && <span style={{ ...mono, textTransform: 'none' }}>{number}</span>}
      <span style={{ fontSize: 'var(--text-row)', fontWeight: 600, fontStretch: '90%', letterSpacing: '-.01em' }}>{title}</span>
      <span style={mono}>{meta} ↗</span>
    </a>
  );
}
