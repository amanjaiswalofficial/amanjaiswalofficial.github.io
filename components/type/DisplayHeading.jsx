import React from 'react';

const WIDTHS = { compressed: '62%', condensed: '72%', semi: '90%', normal: '100%', semiexpanded: '112%', expanded: '125%' };
const PRESETS = {
  index:   { width: 'condensed',    weight: 800, size: 'var(--display-index)',   tracking: '-.045em', leading: .84, mask: '.12em' },
  writing: { width: 'expanded',     weight: 750, size: 'var(--display-writing)', tracking: '-.05em',  leading: .86, mask: '.14em' },
  code:    { width: 'compressed',   weight: 900, size: 'var(--display-code)',    tracking: '-.04em',  leading: .8,  mask: '.08em' },
  work:    { width: 'normal',       weight: 800, size: 'var(--display-work)',    tracking: '-.05em',  leading: .84, mask: '.1em' },
  contact: { width: 'semiexpanded', weight: 800, size: 'var(--display-contact)', tracking: '-.055em', leading: .84, mask: '.1em' },
};

export function DisplayHeading({ lines, preset = 'index', width, weight, size, tracking, leading, mask, style }) {
  const p = PRESETS[preset] || PRESETS.index;
  const m = mask || p.mask;
  const arr = Array.isArray(lines) ? lines : [lines];
  return (
    <div data-par="" role="heading" aria-level={1} style={{
      display: 'flex', flexDirection: 'column', fontFamily: 'var(--font-sans)',
      fontWeight: weight || p.weight, fontStretch: WIDTHS[width || p.width] || width,
      fontSize: size || p.size, lineHeight: leading || p.leading, letterSpacing: tracking || p.tracking,
      marginLeft: '-.05em', ...style,
    }}>
      {arr.map((l, i) => (
        <div key={i} style={{ overflow: 'hidden', padding: `0 .05em ${m}`, marginBottom: `-${m}` }}>
          <div data-line="">{l}</div>
        </div>
      ))}
    </div>
  );
}
