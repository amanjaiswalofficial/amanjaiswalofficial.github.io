import React from 'react';

export function CtaBar({ label, href, bg = 'var(--ink)', fg = 'var(--paper)', mono = false, style }) {
  const [h, setH] = React.useState(false);
  return (
    <a data-r="" href={href} target="_blank" rel="noopener" draggable={false}
      onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12,
        minHeight: 'var(--cta-h)', padding: '0 var(--space-7)', background: bg, color: fg, textDecoration: 'none',
        fontFamily: mono ? 'var(--font-mono)' : 'var(--font-sans)', fontSize: mono ? 14 : 'var(--text-list)',
        fontWeight: mono ? 500 : 600, letterSpacing: h ? (mono ? '.03em' : '.02em') : 0,
        transition: 'letter-spacing var(--dur-hover)', ...style,
      }}>
      <span>{label}</span><span style={{ fontFamily: 'var(--font-mono)' }}>↗</span>
    </a>
  );
}
