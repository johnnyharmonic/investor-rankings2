'use client';
import { useMemo } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { getFilteredInvestors } from '@/data/investors';
import { Card } from '@/components/ui/card';
import InvestorLogo from '@/components/InvestorLogo';
import MethodologyFilters from '@/components/MethodologyFilters';
import { parseFilterValues } from '@/lib/filters';

const LOWER_IS_BETTER = new Set(['m2', 'm7']);
const TABLE_LIMIT = 25;

export default function MethodologyRankingsList({ metric }) {
  const searchParams = useSearchParams();
  const stages = parseFilterValues(searchParams.get('stage'));
  const sectors = parseFilterValues(searchParams.get('sector'));
  const geographies = parseFilterValues(searchParams.get('geography'));

  const lowerIsBetter = LOWER_IS_BETTER.has(metric.id);

  const filterQs = (() => {
    const params = new URLSearchParams();
    if (stages.length) params.set('stage', stages.join(','));
    if (sectors.length) params.set('sector', sectors.join(','));
    if (geographies.length) params.set('geography', geographies.join(','));
    return params.toString();
  })();

  // Mock-data simulation: real data is dynamic enough that any filter combo yields ≥ TABLE_LIMIT
  // matches. Here, we show top filtered matches first, then pad with the next-best non-matches
  // so the table always renders TABLE_LIMIT rows.
  const sorted = useMemo(() => {
    const filtered = getFilteredInvestors({ stage: stages, sector: sectors, geography: geographies, sortBy: metric.id, sortDir: 'desc' });
    if (filtered.length >= TABLE_LIMIT) return filtered.slice(0, TABLE_LIMIT);
    const all = getFilteredInvestors({ sortBy: metric.id, sortDir: 'desc' });
    const seen = new Set(filtered.map(i => i.id));
    const padding = all.filter(i => !seen.has(i.id));
    return [...filtered, ...padding].slice(0, TABLE_LIMIT);
  }, [stages.join(','), sectors.join(','), geographies.join(','), metric.id]);

  const { best, worst } = useMemo(() => {
    if (sorted.length === 0) return { best: null, worst: null };
    const values = sorted.map(i => i.metrics[metric.id]);
    return {
      best: lowerIsBetter ? Math.min(...values) : Math.max(...values),
      worst: lowerIsBetter ? Math.max(...values) : Math.min(...values),
    };
  }, [sorted, metric.id, lowerIsBetter]);

  function pctOfBest(v) {
    if (best === null || best === worst) return 100;
    if (lowerIsBetter) return 10 + ((worst - v) / (worst - best)) * 90;
    return 10 + ((v - worst) / (best - worst)) * 90;
  }

  function formatValue(v) {
    return metric.unit === '%' ? `${v}%` : `${v} mo`;
  }

  return (
    <>
      <MethodologyFilters />

      {/* Ranked list */}
      <Card className="p-0 gap-0">
        <div className="px-4 py-2.5 bg-muted/50 border-b border-border flex items-center gap-4 text-[0.625rem] font-medium text-muted-foreground uppercase tracking-wider">
          <div className="w-10">Rank</div>
          <div className="flex-1 min-w-0">Investor</div>
          <div className="hidden md:block w-32 min-w-0">Stage</div>
          <div className="hidden md:block w-32 min-w-0">Industry</div>
          <div className="hidden md:block w-32 min-w-0">Location</div>
          <div className="w-32 min-w-0 text-right">{metric.label}</div>
        </div>
        {sorted.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-sm font-medium text-foreground mb-1">No investors match these filters</p>
            <p className="text-xs text-muted-foreground">Try clearing filters to see the full ranking.</p>
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {sorted.map((inv, idx) => {
              const value = inv.metrics[metric.id];
              const width = pctOfBest(value);
              const isTop = idx < 3;
              return (
                <li key={inv.id}>
                  <Link
                    href={filterQs ? `/investors/${inv.slug}?${filterQs}` : `/investors/${inv.slug}`}
                    className="flex items-center gap-4 px-4 py-3 hover:bg-accent/50 transition-colors group"
                  >
                    <div className="w-10 flex-shrink-0">
                      <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-[0.625rem] font-bold ${
                        isTop ? 'bg-emerald-100 text-emerald-700' : 'bg-muted text-muted-foreground'
                      }`}>
                        {idx + 1}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0 flex items-center gap-2.5">
                      <InvestorLogo investor={inv} className="w-8 h-8 rounded-md text-[0.625rem] flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-foreground group-hover:underline underline-offset-2 truncate">
                          {inv.name}
                        </p>
                        <p className="text-[0.625rem] text-muted-foreground truncate md:hidden">
                          {inv.stage} · {inv.sector} · {inv.geography}
                        </p>
                      </div>
                    </div>
                    <div className="hidden md:block w-32 min-w-0 text-xs text-muted-foreground truncate">{inv.stage}</div>
                    <div className="hidden md:block w-32 min-w-0 text-xs text-muted-foreground truncate">{inv.sector}</div>
                    <div className="hidden md:block w-32 min-w-0 text-xs text-muted-foreground truncate">{inv.geography}</div>
                    <div className="w-32 min-w-0 flex items-center gap-3 justify-end">
                      {metric.unit === '%' ? (
                        <PercentRing value={value} isTop={isTop} className="hidden sm:block flex-shrink-0" />
                      ) : (
                        <div className="hidden sm:block flex-1 h-1 bg-muted rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${isTop ? 'bg-emerald-500' : 'bg-foreground/30'}`}
                            style={{ width: `${width}%` }}
                          />
                        </div>
                      )}
                      <span className="text-sm font-semibold text-foreground tabular-nums whitespace-nowrap">
                        {formatValue(value)}
                      </span>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </Card>
    </>
  );
}

function PercentRing({ value, isTop, className = '' }) {
  const r = 6;
  const c = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(100, value));
  const dash = (pct / 100) * c;
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" className={`-rotate-90 ${className}`} aria-hidden="true">
      <circle cx="8" cy="8" r={r} fill="none" strokeWidth="2" className="stroke-muted" />
      <circle
        cx="8"
        cy="8"
        r={r}
        fill="none"
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray={`${dash} ${c}`}
        className={isTop ? 'stroke-emerald-500' : 'stroke-foreground/30'}
      />
    </svg>
  );
}

