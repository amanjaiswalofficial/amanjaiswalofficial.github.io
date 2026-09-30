import React from 'react';

export function RoleRow({ when, title, org, logo, href, style }) {
  const [h, setH] = React.useState(false);
  const Tag = href ? 'a' : 'div';
  const link = href ? { href, target: '_blank', rel: 'noopener', draggable: false, onMouseEnter: () => setH(true), onMouseLeave: () => setH(false) } : {};
  const mono = { fontFamily: 'var(--font-mono)', fontSize: 'var(--text-meta)', textTransform: 'uppercase' };
  return (
    <Tag data-r="" {...link} style={{
      display: 'grid', gridTemplateColumns: '76px minmax(0,1fr)', columnGap: 'var(--space-5)', rowGap: 6, alignItems: 'baseline',
      padding: 'clamp(10px,1.8vh,14px) 0', borderTop: 'var(--hairline) solid var(--row-rule, currentColor)', color: 'inherit', textDecoration: 'none',
      paddingLeft: h ? 'var(--space-4)' : 0, transition: 'padding var(--dur-hover) var(--ease-hover)', ...style,
    }}>
      <span style={{ ...mono, letterSpacing: 'var(--tracking-meta-tight)' }}>{when}</span>
      <span style={{ fontSize: 19, fontWeight: 600, fontStretch: '92%', lineHeight: 1.15, letterSpacing: '-.01em', textWrap: 'pretty' }}>{title}</span>
      <span style={{ ...mono, gridColumn: 2, display: 'flex', alignItems: 'center', gap: 'var(--space-3)', letterSpacing: 'var(--tracking-meta)' }}>
        {logo && <span style={{ width: 20, height: 20, flex: 'none', background: 'var(--ink-on-cobalt)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><img src={logo} alt={org + ' logo'} width={14} height={14} style={{ display: 'block' }} /></span>}
        {org}{href ? ' ↗' : ''}
      </span>
    </Tag>
  );
}
