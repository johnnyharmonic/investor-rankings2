'use client';
import { useMemo } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { getFilteredInvestors } from '@/data/investors';
import { filterByType } from '@/lib/investorTypes';
import InvestorLogo from '@/components/InvestorLogo';
import { parseFilterValues } from '@/lib/filters';
import { RANK_GRADIENT, RANK_NUM_COLOR } from '@/lib/rankStyles';
import { sectorTint, stageTint, typeTint, typeShort } from '@/lib/sectorColors';
import { cn } from '@/lib/utils';

// Shared grid template for header + rows so columns align perfectly.
const GRID_COLS =
  'grid-cols-[40px_minmax(0,1.5fr)_minmax(0,1fr)_minmax(0,0.8fr)_minmax(0,1fr)_minmax(0,1.2fr)_minmax(0,0.8fr)]';

const TABLE_LIMIT = 25;

export default function MethodologyRankingsList({ metric }) {
  const searchParams = useSearchParams();
  const stages = parseFilterValues(searchParams.get('stage'));
  const sectors = parseFilterValues(searchParams.get('sector'));
  const geographies = parseFilterValues(searchParams.get('geography'));
  const types = parseFilterValues(searchParams.get('type'));
  const query = (searchParams.get('q') ?? '').trim();

  const filterQs = (() => {
    const params = new URLSearchParams();
    if (stages.length) params.set('stage', stages.join(','));
    if (sectors.length) params.set('sector', sectors.join(','));
    if (geographies.length) params.set('geography', geographies.join(','));
    if (types.length) params.set('type', types.join(','));
    if (query) params.set('q', query);
    return params.toString();
  })();

  // Mock-data simulation: real data is dynamic enough that any filter combo
  // yields ≥ TABLE_LIMIT matches. Here we show top filtered matches first,
  // then pad with the next-best non-matches so the table always renders TABLE_LIMIT rows.
  // Search is applied AFTER ranks are assigned so each row keeps its original position.
  const sorted = useMemo(() => {
    const base = getFilteredInvestors({
      stage: stages,
      sector: sectors,
      geography: geographies,
      sortBy: metric.id,
      sortDir: 'desc',
    });
    const filtered = filterByType(base, types);
    if (filtered.length >= TABLE_LIMIT) return filtered.slice(0, TABLE_LIMIT);
    const all = getFilteredInvestors({ sortBy: metric.id, sortDir: 'desc' });
    const seen = new Set(filtered.map(i => i.id));
    const padding = all.filter(i => !seen.has(i.id));
    return [...filtered, ...padding].slice(0, TABLE_LIMIT);
  }, [stages.join(','), sectors.join(','), geographies.join(','), types.join(','), metric.id]);

  // Tag each row with its display index BEFORE applying search, so a matched
  // row keeps the # it had in the unsearched list (e.g. Cyberstarts stays #3).
  const visible = useMemo(() => {
    const ranked = sorted.map((inv, idx) => ({ inv, idx }));
    if (!query) return ranked;
    const q = query.toLowerCase();
    return ranked.filter(({ inv }) =>
      inv.name.toLowerCase().includes(q) || (inv.fund || '').toLowerCase().includes(q),
    );
  }, [sorted, query]);

  function formatValue(v) {
    return metric.unit === '%' ? `${v}%` : `${v} mo`;
  }

  return (
    <>
      {/* === md+: table layout === */}
      <div className="hidden md:block bg-black/[0.03] dark:bg-white/[0.03]">
        <div
          className={cn(
            'grid items-center gap-3 px-3 h-12 border-b border-border dark:border-white/[0.06] text-[0.6875rem] font-medium text-muted-foreground',
            GRID_COLS,
          )}
        >
          <div className="text-center">Rank</div>
          <div>Name</div>
          <div>{metric.fullLabel}</div>
          <div>Type</div>
          <div>Stage focus</div>
          <div>Sector focus</div>
          <div>Country focus</div>
        </div>
        {visible.length === 0 ? (
          <EmptyState />
        ) : (
          <ul className="divide-y divide-border dark:divide-white/[0.06]">
            {visible.map(({ inv, idx }) => {
              const value = inv.metrics[metric.id];
              const isTop = idx < 3;
              return (
                <li key={inv.id}>
                  <Link
                    href={filterQs ? `/investors/${inv.slug}?${filterQs}` : `/investors/${inv.slug}`}
                    style={isTop ? { backgroundImage: RANK_GRADIENT[idx] } : undefined}
                    className={cn(
                      'grid items-center gap-3 px-3 py-2.5 hover:bg-accent/40 transition-colors group',
                      GRID_COLS,
                    )}
                  >
                    <RankCell idx={idx} />
                    <NameCell inv={inv} />
                    <span className="font-mono text-sm font-medium text-foreground tabular-nums whitespace-nowrap">
                      {formatValue(value)}
                    </span>
                    <Pill label={typeShort(inv.primaryType)} title={inv.primaryType} tint={typeTint(inv.primaryType)} />
                    <Pill label={inv.stage} tint={stageTint(inv.stage)} />
                    <Pill label={inv.sector} tint={sectorTint(inv.sector)} truncate />
                    <Pill label={inv.geography} tint="bg-violet-500/10 text-violet-700 dark:text-violet-300 ring-violet-500/20" />
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* === <md: card layout === */}
      <div className="md:hidden flex flex-col gap-2">
        {visible.length === 0 ? (
          <EmptyState />
        ) : (
          visible.map(({ inv, idx }) => {
            const value = inv.metrics[metric.id];
            const isTop = idx < 3;
            return (
              <Link
                key={inv.id}
                href={filterQs ? `/investors/${inv.slug}?${filterQs}` : `/investors/${inv.slug}`}
                style={isTop ? { backgroundImage: RANK_GRADIENT[idx] } : undefined}
                className="block rounded-xl ring-1 ring-foreground/10 hover:bg-accent/40 transition-colors p-3"
              >
                <div className="flex items-center gap-3">
                  <RankCell idx={idx} />
                  <InvestorLogo investor={inv} className="w-9 h-9 rounded-md text-[0.625rem] flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground truncate">{inv.name}</p>
                    <div className="flex items-center gap-1.5 mt-1 overflow-hidden">
                      <Pill label={typeShort(inv.primaryType)} tint={typeTint(inv.primaryType)} />
                      <Pill label={inv.stage} tint={stageTint(inv.stage)} />
                      <Pill label={inv.sector} tint={sectorTint(inv.sector)} truncate />
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {metric.unit === '%' && <PercentRing value={value} rankIdx={isTop ? idx : -1} />}
                    <span className="font-mono text-sm font-semibold text-foreground tabular-nums whitespace-nowrap">
                      {formatValue(value)}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })
        )}
      </div>
    </>
  );
}

function EmptyState() {
  return (
    <div className="text-center py-16">
      <p className="text-sm font-medium text-foreground mb-1">No investors match these filters</p>
      <p className="text-xs text-muted-foreground">Try clearing filters to see the full ranking.</p>
    </div>
  );
}

function RankCell({ idx }) {
  const isTop = idx < 3;
  return (
    <span
      className={cn(
        'inline-flex items-center justify-center w-7 h-7 rounded-full font-mono text-xs font-bold tabular-nums flex-shrink-0',
        isTop ? `bg-transparent ${RANK_NUM_COLOR[idx]}` : 'bg-muted text-muted-foreground',
      )}
    >
      {idx + 1}
    </span>
  );
}

function NameCell({ inv }) {
  return (
    <div className="flex items-center gap-2.5 min-w-0">
      <InvestorLogo investor={inv} className="w-8 h-8 rounded-md text-[0.625rem] flex-shrink-0" />
      <p className="text-sm font-medium text-foreground group-hover:underline underline-offset-2 truncate">
        {inv.name}
      </p>
    </div>
  );
}

function Pill({ label, title, tint, truncate, className }) {
  if (!label) return <span className="text-xs text-muted-foreground">—</span>;
  return (
    <span
      title={title || label}
      className={cn(
        'inline-flex w-fit max-w-full items-center justify-self-start px-2 py-0.5 rounded-full text-[0.6875rem] font-medium ring-1',
        tint,
        truncate ? 'truncate' : 'whitespace-nowrap',
        className,
      )}
    >
      <span className={truncate ? 'truncate' : ''}>{label}</span>
    </span>
  );
}

const RING_STROKE = ['stroke-amber-400', 'stroke-slate-300', 'stroke-[#c89882]'];

function PercentRing({ value, rankIdx, className = '' }) {
  const r = 6;
  const c = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(100, value));
  const dash = (pct / 100) * c;
  const stroke = rankIdx >= 0 && rankIdx < 3 ? RING_STROKE[rankIdx] : 'stroke-foreground/30';
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" className={`-rotate-90 flex-shrink-0 ${className}`} aria-hidden="true">
      <circle cx="8" cy="8" r={r} fill="none" strokeWidth="2" className="stroke-muted" />
      <circle
        cx="8"
        cy="8"
        r={r}
        fill="none"
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray={`${dash} ${c}`}
        className={stroke}
      />
    </svg>
  );
}
