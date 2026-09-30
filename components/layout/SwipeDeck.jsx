import React from 'react';
import { Masthead } from '../navigation/Masthead';
import { DeckFooter } from '../navigation/DeckFooter';
import { GridOverlay } from './GridOverlay';

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

export function SwipeDeck({ pages, children, name = '', showGrid = true, hint = 'Swipe →', backdrop = null, onProgress, onChange, apiRef, style }) {
  const { useRef, useState, useEffect } = React;
  const n = pages.length, MAX = n - 1;
  const rootRef = useRef(), bgRef = useRef(), trackRef = useRef();
  const cb = useRef({}); cb.current = { onProgress, onChange };
  const s = useRef({ p: 0, cur: 0, W: 1, ink: 0, hinted: false, dragged: false, wheelUntil: 0, sections: [], pars: [], fills: [] }).current;
  const [index, setIndex] = useState(0);
  const [ink, setInk] = useState(0);
  const [hinted, setHinted] = useState(false);
  const reduced = typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;
  const A = () => window.anime;

  const apply = () => {
    const p = s.p, W = s.W, tf = `translate3d(${-p * W}px,0,0)`;
    bgRef.current.style.transform = tf; trackRef.current.style.transform = tf;
    s.pars.forEach((el, i) => { if (el) el.style.transform = `translate3d(${(i - p) * W * 0.3}px,0,0)`; });
    s.fills.forEach((el, i) => { el.style.transform = `scaleX(${clamp(p - i + 1, 0, 1)})`; });
    const k = clamp(Math.round(p), 0, MAX);
    if (k !== s.ink) { s.ink = k; setInk(k); }
    cb.current.onProgress && cb.current.onProgress(p);
  };

  const reveal = (i, start) => {
    const sec = s.sections[i]; if (!sec || !A()) return;
    const lines = sec.querySelectorAll('[data-line]'), rs = sec.querySelectorAll('[data-r]');
    A().remove(lines); A().remove(rs);
    if (reduced) { lines.forEach(el => { el.style.transform = ''; }); rs.forEach(el => { el.style.opacity = ''; el.style.transform = ''; }); return; }
    A()({ targets: lines, translateY: ['110%', '0%'], duration: 1200, delay: A().stagger(90, { start }), easing: 'cubicBezier(.16,1,.3,1)' });
    A()({ targets: rs, opacity: [0, 1], translateY: [18, 0], duration: 900, delay: A().stagger(45, { start: start + 220 }), easing: 'easeOutExpo' });
  };

  const hideExcept = i => {
    if (reduced || !A()) return;
    s.sections.forEach((sec, j) => {
      if (j === i) return;
      sec.querySelectorAll('[data-line]').forEach(el => { A().remove(el); el.style.transform = 'translateY(110%)'; });
      sec.querySelectorAll('[data-r]').forEach(el => { A().remove(el); el.style.opacity = '0'; });
    });
  };

  const go = (i, fromDrag) => {
    i = clamp(i, 0, MAX);
    const changed = i !== s.cur; s.cur = i;
    if (!A()) { s.p = i; apply(); }
    else {
      A().remove(s);
      const dist = Math.abs(s.p - i);
      A()({
        targets: s, p: i,
        duration: reduced ? 1 : (fromDrag ? 650 : 900 + Math.min(dist, 3) * 120),
        easing: fromDrag ? 'easeOutQuart' : 'cubicBezier(.77,0,.18,1)',
        update: apply, complete: () => hideExcept(s.cur),
      });
    }
    if (changed) {
      setIndex(i); reveal(i, fromDrag ? 60 : 380);
      if (!s.hinted) { s.hinted = true; setHinted(true); }
      cb.current.onChange && cb.current.onChange(i);
    }
  };
  if (apiRef) apiRef.current = { go: i => go(i), next: () => go(s.cur + 1), prev: () => go(s.cur - 1) };

  useEffect(() => {
    const root = rootRef.current, offs = [];
    const on = (t, ev, fn, opt) => { t.addEventListener(ev, fn, opt); offs.push(() => t.removeEventListener(ev, fn, opt)); };
    s.sections = Array.from(trackRef.current.children);
    s.pars = s.sections.map(el => el.querySelector('[data-par]'));
    s.fills = Array.from(root.querySelectorAll('header [data-fill]'));
    const resize = () => {
      s.W = root.clientWidth || 1;
      root.querySelectorAll('[data-desc]').forEach(d => { d.style.display = root.clientHeight < 640 ? 'none' : ''; });
      root.querySelectorAll('[data-content]').forEach(c => { c.style.maxWidth = s.W >= 860 ? Math.min(620, s.W * 0.5) + 'px' : ''; });
      apply();
    };
    let d = null;
    on(root, 'pointerdown', e => {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      d = { x: e.clientX, y: e.clientY, lx: e.clientX, lt: performance.now(), v: 0, lock: null, p0: s.p };
      s.dragged = false;
    });
    on(window, 'pointermove', e => {
      if (!d) return;
      const dx = e.clientX - d.x, dy = e.clientY - d.y;
      if (!d.lock) {
        if (Math.abs(dx) < 8 && Math.abs(dy) < 8) return;
        d.lock = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y';
        if (d.lock === 'x') { A() && A().remove(s); d.p0 = s.p; d.x = e.clientX; s.dragged = true; }
      }
      if (d.lock !== 'x') return;
      const now = performance.now();
      d.v = d.v * 0.5 + ((e.clientX - d.lx) / Math.max(1, now - d.lt)) * 0.5; d.lx = e.clientX; d.lt = now;
      let p = d.p0 - (e.clientX - d.x) / s.W;
      if (p < 0) p *= 0.3; else if (p > MAX) p = MAX + (p - MAX) * 0.3;
      s.p = p; apply();
    });
    const up = () => {
      if (!d) return; const dd = d; d = null;
      if (dd.lock !== 'x') return;
      const moved = s.p - s.cur; let t = s.cur;
      if (dd.v < -0.35) t++; else if (dd.v > 0.35) t--; else if (moved > 0.2) t++; else if (moved < -0.2) t--;
      go(t, true);
      setTimeout(() => { s.dragged = false; }, 60);
    };
    on(window, 'pointerup', up); on(window, 'pointercancel', up);
    on(root, 'click', e => { if (s.dragged) { e.preventDefault(); e.stopPropagation(); } }, true);
    on(root, 'dragstart', e => e.preventDefault());
    on(root, 'wheel', e => {
      const ax = Math.abs(e.deltaX), ay = Math.abs(e.deltaY);
      const sc = s.sections[s.cur] && s.sections[s.cur].firstElementChild;
      const scrollable = sc && sc.scrollHeight > sc.clientHeight + 2;
      const dv = ax > ay ? e.deltaX : (scrollable ? 0 : e.deltaY);
      if (Math.abs(dv) < 10) return;
      const now = performance.now();
      if (now < s.wheelUntil) { s.wheelUntil = Math.max(s.wheelUntil, now + 220); return; }
      s.wheelUntil = now + 900; go(s.cur + Math.sign(dv));
    }, { passive: true });
    on(window, 'keydown', e => {
      if (e.key === 'ArrowRight' || e.key === 'PageDown') go(s.cur + 1);
      else if (e.key === 'ArrowLeft' || e.key === 'PageUp') go(s.cur - 1);
    });
    on(window, 'resize', resize);
    resize(); hideExcept(0);
    let t0 = setTimeout(function wait() { if (A()) { hideExcept(0); reveal(0, 150); } else t0 = setTimeout(wait, 60); }, 0);
    return () => { clearTimeout(t0); offs.forEach(f => f()); A() && A().remove(s); };
  }, [n]);

  const inkColor = pages[ink].ink;
  return (
    <div ref={rootRef} style={{ position: 'relative', width: '100%', height: '100dvh', overflow: 'hidden', touchAction: 'pan-y', userSelect: 'none', fontFamily: 'var(--font-sans)', background: pages[0].bg, ...style }}>
      <div ref={bgRef} style={{ position: 'absolute', top: 0, left: 0, height: '100%', width: `${n * 100}%`, display: 'flex', willChange: 'transform', zIndex: 0 }}>
        {pages.map((pg, i) => <div key={i} style={{ flex: `0 0 ${100 / n}%`, height: '100%', background: pg.bg }}></div>)}
      </div>
      {showGrid && <GridOverlay color={inkColor} />}
      <div style={{ position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none' }}>{backdrop}</div>
      <div ref={trackRef} style={{ position: 'absolute', top: 0, left: 0, height: '100%', width: `${n * 100}%`, display: 'flex', willChange: 'transform', zIndex: 3 }}>
        {React.Children.toArray(children).map((c, i) => <div key={i} style={{ flex: `0 0 ${100 / n}%`, height: '100%', position: 'relative' }}>{c}</div>)}
      </div>
      <Masthead name={name} pageName={pages[index].label} index={index} total={n} progress={index} labels={pages.map(p => p.label)} onSelect={i => go(i)} color={inkColor} />
      <DeckFooter hint={hint} hintVisible={!hinted} onPrev={() => go(s.cur - 1)} onNext={() => go(s.cur + 1)} color={inkColor} />
    </div>
  );
}
