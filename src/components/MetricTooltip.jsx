'use client';
import { useState } from 'react';

export default function MetricTooltip({ metric, value }) {
  const [show, setShow] = useState(false);

  const displayValue = metric.unit === '%'
    ? `${value}%`
    : metric.unit === 'mo'
    ? `${value} mo`
    : value;

  return (
    <div className="relative inline-block">
      <button
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        onFocus={() => setShow(true)}
        onBlur={() => setShow(false)}
        className="flex items-center gap-1 group"
        aria-describedby={`tooltip-${metric.id}`}
      >
        <span className="font-medium text-gray-800">{displayValue}</span>
        {metric.caveat && (
          <span className="text-amber-500 text-xs" title="Higher uncertainty">⚠</span>
        )}
        <span className="text-gray-300 group-hover:text-gray-500 transition-colors text-xs">ⓘ</span>
      </button>

      {show && (
        <div
          id={`tooltip-${metric.id}`}
          role="tooltip"
          className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 bg-gray-900 text-white text-xs rounded-lg px-3 py-2 shadow-lg pointer-events-none"
        >
          <p className="font-semibold mb-1">{metric.fullLabel}</p>
          <p className="text-gray-300 leading-relaxed">{metric.description}</p>
          {metric.caveat && (
            <p className="text-amber-400 mt-1 text-xs">⚠ Higher estimate rate — interpret with caution.</p>
          )}
          {/* Arrow */}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
        </div>
      )}
    </div>
  );
}
