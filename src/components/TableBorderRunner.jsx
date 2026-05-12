'use client';
import { useEffect, useRef, useState, useId } from 'react';

const R = 40;
const RUNNER_LEN = 90;
const DURATION = '6s';
const COLOR = 'rgba(125, 211, 252, 0.95)';

export default function TableBorderRunner() {
  const ref = useRef(null);
  const [dims, setDims] = useState({ w: 0, h: 0 });
  const id = useId();

  useEffect(() => {
    const el = ref.current?.parentElement;
    if (!el) return;
    const update = () => {
      const r = el.getBoundingClientRect();
      setDims({ w: r.width, h: r.height });
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  if (!dims.w || !dims.h) {
    return <div ref={ref} className="absolute inset-0 pointer-events-none" aria-hidden="true" />;
  }

  const { w, h } = dims;

  // CW runner: top-left start → top edge → top-right corner → right edge → end at bottom-right
  const pathCW = `M ${R} 0 L ${w - R} 0 A ${R} ${R} 0 0 1 ${w} ${R} L ${w} ${h - R} A ${R} ${R} 0 0 1 ${w - R} ${h}`;
  // CCW runner: top-left start → top-left corner → left edge → bottom-left corner → bottom edge → end at bottom-right
  const pathCCW = `M ${R} 0 A ${R} ${R} 0 0 0 0 ${R} L 0 ${h - R} A ${R} ${R} 0 0 0 ${R} ${h} L ${w - R} ${h}`;

  const cornerLen = (Math.PI * R) / 2;
  const lenCW = w - 2 * R + cornerLen + (h - 2 * R) + cornerLen;
  const lenCCW = cornerLen + (h - 2 * R) + cornerLen + (w - 2 * R);

  return (
    <div ref={ref} className="absolute inset-0 pointer-events-none" aria-hidden="true">
      <svg
        className="absolute inset-0 overflow-visible"
        width={w}
        height={h}
        viewBox={`0 0 ${w} ${h}`}
      >
        <defs>
          <filter id={`${id}-glow`} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <path
          d={pathCCW}
          stroke={COLOR}
          strokeWidth="2"
          fill="none"
          filter={`url(#${id}-glow)`}
          strokeLinecap="round"
          strokeDasharray={`${RUNNER_LEN} ${lenCCW}`}
          strokeDashoffset="0"
        >
          <animate
            attributeName="stroke-dashoffset"
            from="0"
            to={-(lenCCW + RUNNER_LEN)}
            dur={DURATION}
            repeatCount="indefinite"
          />
          <animate
            attributeName="opacity"
            from="1"
            to="0.1"
            dur={DURATION}
            repeatCount="indefinite"
          />
        </path>

        <path
          d={pathCW}
          stroke={COLOR}
          strokeWidth="2"
          fill="none"
          filter={`url(#${id}-glow)`}
          strokeLinecap="round"
          strokeDasharray={`${RUNNER_LEN} ${lenCW}`}
          strokeDashoffset="0"
        >
          <animate
            attributeName="stroke-dashoffset"
            from="0"
            to={-(lenCW + RUNNER_LEN)}
            dur={DURATION}
            repeatCount="indefinite"
          />
          <animate
            attributeName="opacity"
            from="1"
            to="0.1"
            dur={DURATION}
            repeatCount="indefinite"
          />
        </path>
      </svg>
    </div>
  );
}
