import React from 'react';

export function DatedRow({ date, title, href, style }) {
  const [h, setH] = React.useState(false);
  return (
    <a data-r="" href={href} target="_blank" rel="noopener" draggable={false}
      onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{
        display: 'grid', gridTemplateColumns: '76px minmax(0,1fr)', columnGap: 'var(--space-5)', alignItems: 'baseline',
        minHeight: 'var(--hit)', boxSizing: 'border-box', alignContent: 'center', padding: 'var(--row-pad-list) 0', borderTop: 'var(--hairline) solid var(--row-rule, currentColor)',
        color: 'inherit', textDecoration: 'none',
        paddingLeft: h ? 'var(--space-4)' : 0, transition: 'padding var(--dur-hover) var(--ease-hover)', ...style,
      }}>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-meta)' }}>{date}</span>
      <span style={{ fontSize: 'var(--text-list)', fontWeight: 500, lineHeight: 'var(--leading-list)', textWrap: 'pretty' }}>{title}</span>
    </a>
  );
}
