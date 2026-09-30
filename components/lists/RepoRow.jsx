import React from 'react';

export function RepoRow({ name, lang, description, href, muted = 'var(--muted-on-carbon)', style }) {
  const [h, setH] = React.useState(false);
  return (
    <a data-r="" href={href} target="_blank" rel="noopener" draggable={false}
      onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{
        display: 'grid', gridTemplateColumns: 'minmax(0,1fr) auto', columnGap: 'var(--space-5)', rowGap: 'var(--space-1)',
        minHeight: 'var(--hit)', boxSizing: 'border-box', alignContent: 'center', padding: 'var(--row-pad-repo) 0', borderTop: 'var(--hairline) solid var(--row-rule, currentColor)',
        color: 'inherit', textDecoration: 'none',
        paddingLeft: h ? 'var(--space-4)' : 0, transition: 'padding var(--dur-hover) var(--ease-hover)', ...style,
      }}>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-code)', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{name}</span>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-meta)', color: muted }}>{lang}</span>
      {description && <span data-desc="" style={{ gridColumn: '1 / -1', fontSize: 'var(--text-small)', lineHeight: 1.3, color: muted }}>{description}</span>}
    </a>
  );
}
