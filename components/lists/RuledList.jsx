import React from 'react';

export function RuledList({ children, rule = 'currentColor', style }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', borderBottom: `var(--hairline) solid ${rule}`, '--row-rule': rule, ...style }}>
      {children}
    </div>
  );
}
