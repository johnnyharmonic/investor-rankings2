'use client';
import { useState } from 'react';

function nameToDomain(name) {
  return name.toLowerCase().replace(/[^a-z0-9]/g, '') + '.com';
}

const SOURCES = [
  domain => `https://icons.duckduckgo.com/ip3/${domain}.ico`,
  domain => `https://www.google.com/s2/favicons?domain=${domain}&sz=128`,
];

export default function PortfolioCompanyCard({ name, domain }) {
  const [idx, setIdx] = useState(0);
  const resolvedDomain = domain || nameToDomain(name);
  const showFallback = idx >= SOURCES.length;

  return (
    <a
      href={`https://${resolvedDomain}`}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative aspect-[3/2] rounded-lg ring-1 ring-border bg-card overflow-hidden flex items-center justify-center hover:ring-foreground/30 transition-shadow"
      aria-label={`${name} (opens in new tab)`}
    >
      {showFallback ? (
        <span className="text-2xl font-bold text-muted-foreground">{name.charAt(0)}</span>
      ) : (
        <img
          src={SOURCES[idx](resolvedDomain)}
          alt=""
          loading="lazy"
          onError={() => setIdx(i => i + 1)}
          className="w-12 h-12 object-contain"
        />
      )}
      <div className="absolute inset-0 backdrop-blur-sm bg-foreground/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center px-2">
        <span className="text-sm font-medium text-background text-center">{name}</span>
      </div>
    </a>
  );
}
