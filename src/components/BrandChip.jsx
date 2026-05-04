'use client';
import { useState } from 'react';

const SOURCES = [
  domain => `https://icons.duckduckgo.com/ip3/${domain}.ico`,
  domain => `https://www.google.com/s2/favicons?domain=${domain}&sz=128`,
];

export default function BrandChip({ domain, name, alt }) {
  const [idx, setIdx] = useState(0);
  const showLogo = idx < SOURCES.length;

  return (
    <div className="inline-flex items-center gap-2 rounded-full bg-card ring-1 ring-foreground/10 px-3 py-1.5">
      <span className="w-4 h-4 flex items-center justify-center overflow-hidden">
        {showLogo && (
          <img
            src={SOURCES[idx](domain)}
            alt={alt}
            onError={() => setIdx(i => i + 1)}
            className="w-full h-full object-contain"
          />
        )}
      </span>
      <span className="text-xs font-medium text-foreground">{name}</span>
    </div>
  );
}
