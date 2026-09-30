import React from 'react';

export function SquareButton({ children, onClick, label, style }) {
  const [p, setP] = React.useState(false);
  return (
    <button onClick={onClick} aria-label={label}
      onPointerDown={() => setP(true)} onPointerUp={() => setP(false)} onPointerLeave={() => setP(false)}
      style={{
        width: 'var(--hit)', height: 'var(--hit)', display: 'flex', alignItems: 'center', justifyContent: 'center',
        border: 'var(--hairline) solid currentColor', borderRadius: 0, background: 'transparent', color: 'inherit',
        cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: 16, padding: 0,
        transform: p ? 'scale(.92)' : 'none', transition: 'transform .3s', ...style,
      }}>{children}</button>
  );
}
