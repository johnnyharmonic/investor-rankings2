'use client';
import { useState, useRef, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import InvestorLogo from '@/components/InvestorLogo';
import { HugeiconsIcon } from '@hugeicons/react';
import { Search01Icon } from '@hugeicons/core-free-icons';
import { investors } from '@/data/investors';

const MAX_RESULTS = 6;

export default function InvestorSearch() {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);
  const containerRef = useRef(null);
  const router = useRouter();

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return investors
      .filter(i => i.name.toLowerCase().includes(q) || i.fund.toLowerCase().includes(q))
      .slice(0, MAX_RESULTS);
  }, [query]);

  useEffect(() => {
    function handleClick(e) {
      if (!containerRef.current?.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  useEffect(() => {
    setActiveIdx(0);
  }, [query]);

  function handleKeyDown(e) {
    if (!open && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
      setOpen(true);
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIdx(i => Math.min(i + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIdx(i => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      const inv = results[activeIdx];
      if (inv) {
        e.preventDefault();
        router.push(`/investors/${inv.slug}`);
      }
    } else if (e.key === 'Escape') {
      setQuery('');
      setOpen(false);
    }
  }

  const showDropdown = open && query.trim().length > 0;

  return (
    <div ref={containerRef} className="relative w-full max-w-xl">
      <div className="relative">
        <HugeiconsIcon
          icon={Search01Icon}
          strokeWidth={2}
          className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none"
        />
        <Input
          type="text"
          placeholder="Search for an investor — Sequoia, a16z, Benchmark…"
          value={query}
          onChange={e => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          className="h-9 pl-10 pr-3 text-sm md:text-sm"
          aria-label="Search investors"
          aria-autocomplete="list"
          aria-expanded={showDropdown}
        />
      </div>

      {showDropdown && (
        <div className="absolute left-0 right-0 top-full mt-2 bg-popover text-popover-foreground rounded-lg ring-1 ring-foreground/10 shadow-md overflow-hidden z-20">
          {results.length === 0 ? (
            <div className="px-4 py-6 text-xs/relaxed text-muted-foreground text-center">
              No investors match <span className="font-medium text-foreground">"{query}"</span>
            </div>
          ) : (
            <ul role="listbox" className="p-1">
              {results.map((inv, idx) => (
                <li key={inv.id} role="option" aria-selected={idx === activeIdx}>
                  <Link
                    href={`/investors/${inv.slug}`}
                    onMouseEnter={() => setActiveIdx(idx)}
                    onClick={() => setOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                      idx === activeIdx ? 'bg-accent text-accent-foreground' : ''
                    }`}
                  >
                    <InvestorLogo investor={inv} className="w-8 h-8 rounded-md text-[0.625rem]" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-foreground truncate">{inv.name}</p>
                      <p className="text-[0.625rem] text-muted-foreground truncate">
                        {inv.fund !== inv.name ? `${inv.fund} · ` : ''}{inv.stage} · {inv.geography}
                      </p>
                    </div>
                    <Badge variant="outline">#{inv.rank}</Badge>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
