'use client';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { METRICS } from '@/data/investors';
import { cn } from '@/lib/utils';

// Three large section headers across the top of the rankings table. The
// active metric shows in full colour; the other two are dimmed and act as
// links to switch the ranking.
export default function MethodologyTabs({ activeMetricId }) {
  const searchParams = useSearchParams();
  const filterQs = (() => {
    const params = new URLSearchParams();
    for (const key of ['stage', 'sector', 'geography', 'type', 'q']) {
      const v = searchParams.get(key);
      if (v) params.set(key, v);
    }
    return params.toString();
  })();

  return (
    <nav
      aria-label="Methodologies"
      className="grid grid-cols-1 md:grid-cols-3 md:divide-x divide-y md:divide-y-0 divide-border dark:divide-white/[0.06] border-b border-border dark:border-white/[0.06]"
    >
      {Object.values(METRICS).map(m => {
        const active = m.id === activeMetricId;
        const href = filterQs ? `/rankings/${m.id}?${filterQs}` : `/rankings/${m.id}`;
        return (
          <Link
            key={m.id}
            href={href}
            aria-current={active ? 'page' : undefined}
            className={cn(
              'group block px-6 py-5 transition-colors',
              active
                ? 'text-foreground bg-black/[0.03] dark:bg-white/[0.03]'
                : 'text-muted-foreground/40 hover:text-muted-foreground',
            )}
          >
            <h2
              className={cn(
                'font-heading text-xl/snug font-medium tracking-tight mb-1.5',
                active ? 'text-foreground' : 'text-current',
              )}
            >
              {m.fullLabel}
            </h2>
            <p className={cn(
              'text-xs/relaxed line-clamp-2',
              active ? 'text-muted-foreground/100' : 'text-current',
            )}>
              {m.description}
            </p>
          </Link>
        );
      })}
    </nav>
  );
}
