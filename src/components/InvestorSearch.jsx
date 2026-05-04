'use client';
import { useState, useRef, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
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
        <svg
          className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
        </svg>
        <input
          type="text"
          placeholder="Search for an investor — Sequoia, a16z, Benchmark…"
          value={query}
          onChange={e => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          className="w-full pl-12 pr-4 py-3.5 text-base bg-white border border-gray-200 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-harmonic-500 focus:border-transparent placeholder:text-gray-400"
          aria-label="Search investors"
          aria-autocomplete="list"
          aria-expanded={showDropdown}
        />
      </div>

      {showDropdown && (
        <div className="absolute left-0 right-0 top-full mt-2 bg-white border border-gray-200 rounded-2xl shadow-lg overflow-hidden z-20">
          {results.length === 0 ? (
            <div className="px-4 py-6 text-sm text-gray-500 text-center">
              No investors match <span className="font-medium text-gray-700">"{query}"</span>
            </div>
          ) : (
            <ul role="listbox">
              {results.map((inv, idx) => (
                <li key={inv.id} role="option" aria-selected={idx === activeIdx}>
                  <Link
                    href={`/investors/${inv.slug}`}
                    onMouseEnter={() => setActiveIdx(idx)}
                    onClick={() => setOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 transition-colors ${
                      idx === activeIdx ? 'bg-blue-50/60' : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600 flex-shrink-0">
                      {inv.logo}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-gray-900 truncate">{inv.name}</p>
                      <p className="text-xs text-gray-400 truncate">
                        {inv.fund !== inv.name ? `${inv.fund} · ` : ''}{inv.stage} · {inv.geography}
                      </p>
                    </div>
                    <span className="text-xs text-gray-400 bg-gray-50 border border-gray-200 rounded-full px-2 py-0.5 whitespace-nowrap">
                      #{inv.rank}
                    </span>
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
