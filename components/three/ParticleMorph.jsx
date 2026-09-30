import React from 'react';

const TAU = Math.PI * 2;

export function makeParticleShapes(N = 2197, seed0 = 7) {
  let seed = seed0;
  const rnd = () => { seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
  const mk = fn => { const a = new Float32Array(N * 3); for (let i = 0; i < N; i++) { const v = fn(i); a[i * 3] = v[0]; a[i * 3 + 1] = v[1]; a[i * 3 + 2] = v[2]; } return a; };
  const sphere = mk(i => { const y = 1 - 2 * (i + 0.5) / N, r = Math.sqrt(1 - y * y), th = i * 2.399963; return [Math.cos(th) * r * 1.6, y * 1.6, Math.sin(th) * r * 1.6]; });
  const segs = []; let total = 0;
  for (let l = 0; l < 10; l++) {
    const len = l === 9 ? 1.4 : 2.6 + rnd() * 0.8; let x = 0;
    while (x < len) { const w = Math.min(0.14 + rnd() * 0.5, len - x); segs.push({ l, x0: x, c: total }); total += w; x += w + 0.14; }
  }
  let si = 0; const per = Math.ceil(N / 3);
  const lines = mk(i => {
    const row = i % 3, u = ((Math.floor(i / 3) + 0.5) / per) * total;
    while (si < segs.length - 1 && segs[si + 1].c <= u) si++;
    const sg = segs[si];
    return [-1.7 + sg.x0 + (u - sg.c), 1.35 - sg.l * 0.3 + row * 0.05, 0];
  });
  const g = 13;
  const lattice = mk(i => [((i % g) / (g - 1) - 0.5) * 2.3, ((Math.floor(i / g) % g) / (g - 1) - 0.5) * 2.3, (Math.floor(i / (g * g)) / (g - 1) - 0.5) * 2.3]);
  const helix = mk(i => {
    const t = Math.floor(i / 2) / (N / 2), a0 = t * Math.PI * 6, y = (t - 0.5) * 3.4, j = () => (rnd() - 0.5) * 0.12;
    if (i % 9 === 0) { const q = 1 - 2 * rnd(); return [Math.cos(a0) * 0.9 * q, y, Math.sin(a0) * 0.9 * q]; }
    const a = a0 + (i % 2) * Math.PI;
    return [Math.cos(a) * 0.9 + j(), y + j() * 0.5, Math.sin(a) * 0.9 + j()];
  });
  const torus = mk(i => {
    const a = (i % 169) / 169 * TAU, b = Math.floor(i / 169) / 13 * TAU, R = 1.35, r = 0.42;
    return [(R + r * Math.cos(b)) * Math.cos(a), r * Math.sin(b), (R + r * Math.cos(b)) * Math.sin(a)];
  });
  const delays = new Float32Array(N).map(() => rnd());
  const dirs = mk(() => { const u = rnd() * 2 - 1, th = rnd() * TAU, s = Math.sqrt(1 - u * u); return [s * Math.cos(th), u, s * Math.sin(th)]; });
  return { sphere, lines, lattice, helix, torus, delays, dirs };
}

function defaultLayout(i, W, H, contentTop) {
  if (W >= 860) {
    const pad = Math.min(56, Math.max(20, W * 0.05)), left = pad + Math.min(620, W * 0.5) + 40, right = W - pad;
    return { cx: (left + right) / 2, cy: H / 2, size: Math.min(right - left, H * 0.72) };
  }
  const top = 64, free = Math.max(0, (contentTop ?? H * 0.5) - top - 8), size = Math.max(120, Math.min(W * 0.84, free));
  return { cx: W / 2, cy: top + Math.max(free, size) / 2, size };
}

export const ParticleMorph = React.forwardRef(function ParticleMorph(
  { colors, shapes = ['sphere', 'lines', 'lattice', 'helix', 'torus'], dotSize = 2.4, spin = 1, count = 2197, layout = defaultLayout, contentSelector = '[data-content]', style }, ref) {
  const canvasRef = React.useRef();
  const s = React.useRef({ p: 0, lastP: -1, rot: 0, tilt: { x: 0, y: 0, tx: 0, ty: 0 } }).current;
  s.props = { colors, shapes, dotSize, spin, layout, contentSelector };
  React.useImperativeHandle(ref, () => ({ setProgress: p => { s.p = p; } }), []);

  React.useEffect(() => {
    let alive = true, raf, t0, cleanup = () => {};
    const init = () => {
      const T = window.THREE, cv = canvasRef.current;
      const r = new T.WebGLRenderer({ canvas: cv, antialias: true, alpha: true });
      r.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2)); r.setClearColor(0, 0);
      const scene = new T.Scene(), cam = new T.PerspectiveCamera(32, 1, 0.1, 100); cam.position.z = 10;
      const S = makeParticleShapes(count), P = new Float32Array(S[s.props.shapes[0]]);
      const geom = new T.BufferGeometry(); geom.setAttribute('position', new T.BufferAttribute(P, 3));
      const c = document.createElement('canvas'); c.width = c.height = 64;
      const x = c.getContext('2d'); x.fillStyle = '#fff'; x.beginPath(); x.arc(32, 32, 30, 0, TAU); x.fill();
      const mat = new T.PointsMaterial({ map: new T.CanvasTexture(c), alphaTest: 0.5, sizeAttenuation: true });
      const group = new T.Group(); group.add(new T.Points(geom, mat)); scene.add(group);
      const cA = new T.Color(), cB = new T.Color();
      let W = 1, H = 1, visH = 1, lay = [];
      const measure = () => {
        const rect = cv.getBoundingClientRect(), els = document.querySelectorAll(s.props.contentSelector), wpp = visH / H;
        lay = s.props.shapes.map((_, i) => {
          const el = els[i], top = el ? el.getBoundingClientRect().top - rect.top : undefined;
          const L = s.props.layout(i, W, H, top);
          return { x: (L.cx - W / 2) * wpp, y: -(L.cy - H / 2) * wpp, s: L.size * wpp / 3.4 };
        });
      };
      const resize = () => {
        W = cv.clientWidth || 1; H = cv.clientHeight || 1;
        r.setSize(W, H, false); cam.aspect = W / H; cam.updateProjectionMatrix();
        visH = 2 * cam.position.z * Math.tan(cam.fov * Math.PI / 360);
        measure(); s.lastP = -1;
      };
      const morph = (a, b, f) => {
        const A = S[s.props.shapes[a]], B = S[s.props.shapes[b]], D = S.delays, R = S.dirs;
        if (f <= 0) P.set(A); else if (f >= 1) P.set(B);
        else for (let i = 0; i < count; i++) {
          let t = f * 1.7 - D[i] * 0.7; t = t < 0 ? 0 : t > 1 ? 1 : t; t = t * t * (3 - 2 * t);
          const burst = Math.sin(t * Math.PI) * 0.35, k = i * 3;
          P[k] = A[k] + (B[k] - A[k]) * t + R[k] * burst;
          P[k + 1] = A[k + 1] + (B[k + 1] - A[k + 1]) * t + R[k + 1] * burst;
          P[k + 2] = A[k + 2] + (B[k + 2] - A[k + 2]) * t + R[k + 2] * burst;
        }
        geom.attributes.position.needsUpdate = true;
      };
      const onMove = e => { if (e.pointerType === 'mouse') { s.tilt.tx = e.clientX / W * 2 - 1; s.tilt.ty = e.clientY / H * 2 - 1; } };
      const onTilt = e => { if (e.gamma == null) return; s.tilt.tx = Math.max(-1, Math.min(1, e.gamma / 30)); s.tilt.ty = Math.max(-1, Math.min(1, (e.beta - 45) / 30)); };
      window.addEventListener('resize', resize); window.addEventListener('pointermove', onMove); window.addEventListener('deviceorientation', onTilt);
      resize(); if (document.fonts) document.fonts.ready.then(() => alive && measure());
      let last = performance.now();
      const loop = () => {
        if (!alive) return; raf = requestAnimationFrame(loop);
        const now = performance.now(), dt = Math.min(50, now - last); last = now;
        const M = s.props.shapes.length - 1, p = Math.max(0, Math.min(M, s.p));
        const a = Math.min(Math.max(M - 1, 0), Math.floor(p)), b = Math.min(M, a + 1), f = p - a;
        if (p !== s.lastP) { morph(a, b, f); s.lastP = p; }
        const e = f * f * (3 - 2 * f), la = lay[a], lb = lay[b];
        group.position.set(la.x + (lb.x - la.x) * e, la.y + (lb.y - la.y) * e, 0);
        group.scale.setScalar(la.s + (lb.s - la.s) * e);
        mat.size = s.props.dotSize * cam.position.z / (H / 2);
        mat.color.copy(cA.set(s.props.colors[a])).lerp(cB.set(s.props.colors[b]), e);
        s.rot += dt * 0.00018 * s.props.spin;
        const T2 = s.tilt; T2.x += (T2.tx - T2.x) * 0.05; T2.y += (T2.ty - T2.y) * 0.05;
        group.rotation.set(0.38 + T2.y * 0.25, s.rot + p * Math.PI + T2.x * 0.35, 0);
        r.render(scene, cam);
      };
      loop();
      cleanup = () => {
        window.removeEventListener('resize', resize); window.removeEventListener('pointermove', onMove); window.removeEventListener('deviceorientation', onTilt);
        r.dispose(); geom.dispose(); mat.dispose();
      };
    };
    const wait = () => { if (!alive) return; if (window.THREE && canvasRef.current) { try { init(); } catch (e) { console.warn('ParticleMorph: WebGL unavailable', e); } } else t0 = setTimeout(wait, 60); };
    wait();
    return () => { alive = false; clearTimeout(t0); cancelAnimationFrame(raf); cleanup(); };
  }, [count]);

  return <canvas ref={canvasRef} aria-hidden="true" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block', pointerEvents: 'none', ...style }}></canvas>;
});
