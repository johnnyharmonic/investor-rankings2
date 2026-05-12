'use client';
import { useState } from 'react';
import { cn } from '@/lib/utils';

const SOURCES = [
  domain => `https://www.google.com/s2/favicons?domain=${domain}&sz=256`,
  domain => `https://icons.duckduckgo.com/ip3/${domain}.ico`,
];

export default function InvestorLogo({ investor, className }) {
  const [idx, setIdx] = useState(0);
  const showFallback = !investor.domain || idx >= SOURCES.length;

  if (showFallback) {
    return (
      <div
        className={cn(
          'flex items-center justify-center bg-muted text-muted-foreground font-bold flex-shrink-0',
          className
        )}
      >
        {investor.logo}
      </div>
    );
  }

  return (
    <div
      className={cn(
        'flex items-center justify-center bg-card ring-1 ring-border overflow-hidden flex-shrink-0',
        className
      )}
    >
      <img
        src={SOURCES[idx](investor.domain)}
        alt={`${investor.name} logo`}
        loading="lazy"
        onError={() => setIdx(i => i + 1)}
        className="w-full h-full object-contain"
      />
    </div>
  );
}
