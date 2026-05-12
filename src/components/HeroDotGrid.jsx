'use client';
import { useEffect, useRef } from 'react';

const NODE_COUNT = 1600;
const SETTLE_DURATION_MS = 2200;
const SETTLE_DELAY_MS = 250;
const FADE_IN_MS = 700;

// Per-section shape keyframes — sphere → prolate → oblate → twisted.
// Each keyframe deforms the unit sphere differently; the renderer lerps
// between them based on how far the user has scrolled (in viewports).
const SHAPES = [
  { sx: 1.00, sy: 1.00, sz: 1.00, twist: 0.00 }, // 0: hero — sphere
  { sx: 0.85, sy: 1.25, sz: 0.85, twist: 0.10 }, // 1: next round — prolate
  { sx: 1.18, sy: 0.78, sz: 1.18, twist: 0.45 }, // 2: follow-on — oblate + twist
  { sx: 0.95, sy: 1.05, sz: 0.95, twist: 1.10 }, // 3: exit — strong twist
];

// Fibonacci-spiral distribution on a unit sphere.
function buildNodes(count) {
  const golden = Math.PI * (3 - Math.sqrt(5));
  const nodes = [];
  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const theta = golden * i;
    const x = Math.cos(theta) * r;
    const z = Math.sin(theta) * r;

    // Scatter origin: a random point well outside the unit sphere.
    const sa = Math.random() * Math.PI * 2;
    const sb = Math.acos(2 * Math.random() - 1);
    const sd = 2.4 + Math.random() * 1.6;
    const sx = Math.sin(sb) * Math.cos(sa) * sd;
    const sy = Math.cos(sb) * sd;
    const sz = Math.sin(sb) * Math.sin(sa) * sd;

    nodes.push({
      x, y, z,
      sx, sy, sz,
      delay: Math.random() * 700,
      // Per-node entropy — each axis has its own amplitude / frequency / phase
      // so the sphere never feels static even when the camera and shape are.
      eAx: 0.006 + Math.random() * 0.014,
      eAy: 0.006 + Math.random() * 0.014,
      eAz: 0.006 + Math.random() * 0.014,
      eFx: 0.0005 + Math.random() * 0.0010,
      eFy: 0.0005 + Math.random() * 0.0010,
      eFz: 0.0005 + Math.random() * 0.0010,
      ePx: Math.random() * Math.PI * 2,
      ePy: Math.random() * Math.PI * 2,
      ePz: Math.random() * Math.PI * 2,
    });
  }
  return nodes;
}

function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function lerp(a, b, t) { return a + (b - a) * t; }

export default function HeroDotGrid() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = 0;
    let height = 0;
    let dpr = 1;

    function resize() {
      dpr = window.devicePixelRatio || 1;
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    resize();
    window.addEventListener('resize', resize);

    const nodes = buildNodes(NODE_COUNT);

    // Reduced motion: skip the scatter-and-spin show; render a static sphere.
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const start = performance.now();
    const transformed = new Array(nodes.length);
    let smoothPhase = 0;
    // Accumulator that advances at the motion-scaled rate. Rotation, tilt,
    // and per-node jitter all read this instead of raw `t`, so when the
    // zoom dampens motionScale to 0 the angles freeze (rather than snapping
    // back to their formula-derived value at the new scaled time).
    let slowedTime = 0;
    let lastT = -1;
    let raf = 0;

    function frame(now) {
      const t = now - start;
      const dt = lastT < 0 ? 0 : t - lastT;
      lastT = t;
      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;

      // Scroll-driven shape phase. 1 unit = 1 viewport of scroll.
      // Smooth it so the morph eases between sections instead of jumping.
      const rawPhase = reduceMotion ? 0 : window.scrollY / Math.max(1, window.innerHeight);
      smoothPhase += (rawPhase - smoothPhase) * 0.08;

      // Fly-into-the-sphere zoom — ramps the sphere up 1× → ~3.2× during the
      // hero → first-section scroll, then holds. Combined with the per-section
      // shape morph below, this gives the feeling of the camera diving into
      // the sphere as the first methodology comes into view.
      const zoomT = reduceMotion ? 0 : easeInOutCubic(Math.max(0, Math.min(1, smoothPhase)));
      const zoom = 1 + zoomT * 2.2;
      const radius = Math.min(width, height) * 0.45 * zoom;

      const idx = Math.min(SHAPES.length - 2, Math.max(0, Math.floor(smoothPhase)));
      const tt = Math.min(1, Math.max(0, smoothPhase - idx));
      const a = SHAPES[idx], b = SHAPES[idx + 1];
      const shapeSx = lerp(a.sx, b.sx, tt);
      const shapeSy = lerp(a.sy, b.sy, tt);
      const shapeSz = lerp(a.sz, b.sz, tt);
      const twist = lerp(a.twist, b.twist, tt);

      // Continuous rotation. Add a tiny tilt that slowly oscillates so the
      // sphere never settles into a flat-feeling spin. When the camera
      // zooms in, motion-time advance is throttled so the rotation slows
      // (but never stops) — the up-close swarm shouldn't feel chaotic.
      const motionScale = 1 - zoomT * 0.7;
      slowedTime += dt * motionScale;
      const rotY = reduceMotion ? 0.4 : (slowedTime / 1000) * 0.22;
      const rotX = reduceMotion ? 0.18 : Math.sin(slowedTime / 5200) * 0.18 + 0.05;
      const cosY = Math.cos(rotY), sinY = Math.sin(rotY);
      const cosX = Math.cos(rotX), sinX = Math.sin(rotX);

      for (let i = 0; i < nodes.length; i++) {
        const p = nodes[i];

        let settle = 1;
        let fadeIn = 1;
        if (!reduceMotion) {
          const ts = (t - SETTLE_DELAY_MS - p.delay) / SETTLE_DURATION_MS;
          settle = easeInOutCubic(Math.max(0, Math.min(1, ts)));
          fadeIn = Math.max(0, Math.min(1, (t - p.delay) / FADE_IN_MS));
        }

        // Per-node entropy jitter — small phase-shifted oscillations on each
        // axis so the swarm always shimmers a little. Driven by slowedTime
        // so it freezes alongside the rotation when zoomed in.
        const jx = reduceMotion ? 0 : Math.sin(slowedTime * p.eFx + p.ePx) * p.eAx;
        const jy = reduceMotion ? 0 : Math.sin(slowedTime * p.eFy + p.ePy) * p.eAy;
        const jz = reduceMotion ? 0 : Math.sin(slowedTime * p.eFz + p.ePz) * p.eAz;

        // Settle from scatter-origin to base sphere position, then deform.
        let bx = p.sx + (p.x + jx - p.sx) * settle;
        let by = p.sy + (p.y + jy - p.sy) * settle;
        let bz = p.sz + (p.z + jz - p.sz) * settle;

        // Shape morph (axis scale).
        bx *= shapeSx;
        by *= shapeSy;
        bz *= shapeSz;

        // Twist around Y, scaled by Y position so poles stay anchored.
        if (twist !== 0) {
          const ang = by * twist;
          const cT = Math.cos(ang), sT = Math.sin(ang);
          const tx = bx * cT + bz * sT;
          const tz = -bx * sT + bz * cT;
          bx = tx;
          bz = tz;
        }

        // Rotate around Y, then X.
        const xr = cosY * bx + sinY * bz;
        const zr1 = -sinY * bx + cosY * bz;
        const yr = cosX * by - sinX * zr1;
        const zr = sinX * by + cosX * zr1;

        transformed[i] = {
          px: cx + xr * radius,
          py: cy + yr * radius,
          z: zr,
          fadeIn,
        };
      }

      // Slight dim when zoomed in so the up-close dots don't read as harsh.
      const brightness = 1 - zoomT * 0.3;
      for (let i = 0; i < transformed.length; i++) {
        const A = transformed[i];
        const depth = Math.max(0, Math.min(1, (A.z + 1) / 2));
        const size = 0.35 + depth * 0.85;
        const alpha = (0.18 + depth * 0.62) * A.fadeIn * brightness;
        ctx.beginPath();
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.arc(A.px, A.py, size, 0, Math.PI * 2);
        ctx.fill();
      }

      raf = requestAnimationFrame(frame);
    }

    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="fixed inset-0 -z-10 pointer-events-none"
    />
  );
}
