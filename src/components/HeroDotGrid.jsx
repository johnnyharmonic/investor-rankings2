'use client';
import { useEffect, useRef } from 'react';

export default function HeroDotGrid() {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    const parent = el?.parentElement;
    if (!el || !parent) return;

    function handleMove(e) {
      const r = parent.getBoundingClientRect();
      el.style.setProperty('--mx', `${e.clientX - r.left}px`);
      el.style.setProperty('--my', `${e.clientY - r.top}px`);
      el.style.setProperty('--m-opacity', '1');
    }
    function handleLeave() {
      el.style.setProperty('--m-opacity', '0');
    }

    parent.addEventListener('mousemove', handleMove);
    parent.addEventListener('mouseleave', handleLeave);
    return () => {
      parent.removeEventListener('mousemove', handleMove);
      parent.removeEventListener('mouseleave', handleLeave);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className="hero-dot-grid absolute inset-0 -z-10 pointer-events-none"
      style={{ '--mx': '50%', '--my': '30%', '--m-opacity': '0' }}
    />
  );
}
