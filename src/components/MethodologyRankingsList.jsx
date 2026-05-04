'use client';
import { useState, useMemo } from 'react';
import Link from 'next/link';
import { STAGES, SECTORS, GEOGRAPHIES, getFilteredInvestors } from '@/data/investors';

const LOWER_IS_BETTER = new Set(['m2', 'm7']);

export default function MethodologyRankingsList({ metric }) {
  const [stage, setStage] = useState('All Stages');
  const [sector, setSector] = useState('All Sectors');
  const [geography, setGeography] = useState('All Geographies');

  const lowerIsBetter = LOWER_IS_BETTER.has(metric.id);
  const hasFilters = stage !== 'All Stages' || sector !== 'All Sectors' || geography !== 'All Geographies';

  const sorted = useMemo(
    () => getFilteredInvestors({ stage, sector, geography, sortBy: metric.id, sortDir: 'desc' }),
    [stage, sector, geography, metric.id]
  );

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

  function clearFilters() {
    setStage('All Stages');
    setSector('All Sectors');
    setGeography('All Geographies');
  }

  return (
    <>
      {/* Filters */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6 flex flex-col sm:flex-row gap-3 flex-wrap items-stretch sm:items-center">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide self-center sm:mr-1">
          Filter
        </span>
        <FilterSelect label="Stage" value={stage} onChange={setStage} options={STAGES} />
        <FilterSelect label="Industry" value={sector} onChange={setSector} options={SECTORS} />
        <FilterSelect label="Location" value={geography} onChange={setGeography} options={GEOGRAPHIES} />
        {hasFilters && (
          <button
            onClick={clearFilters}
            className="text-sm text-gray-500 hover:text-gray-800 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors whitespace-nowrap sm:ml-auto"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Ranked list */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
        <div className="px-5 py-3 bg-gray-50 border-b border-gray-200 flex items-center text-xs font-medium text-gray-500 uppercase tracking-wider">
          <div className="w-12">Rank</div>
          <div className="flex-1">Investor</div>
          <div className="hidden sm:block w-32 text-center">Stage</div>
          <div className="w-44 text-right">{metric.label}</div>
        </div>
        {sorted.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p className="text-lg mb-1">No investors match these filters</p>
            <p className="text-sm">Try clearing filters to see the full ranking.</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {sorted.map((inv, idx) => {
              const value = inv.metrics[metric.id];
              const width = pctOfBest(value);
              const isTop = idx < 3;
              return (
                <li key={inv.id}>
                  <Link
                    href={`/investors/${inv.slug}`}
                    className="flex items-center px-5 py-4 hover:bg-blue-50/30 transition-colors group"
                  >
                    <div className="w-12 flex-shrink-0">
                      <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold ${
                        isTop ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'
                      }`}>
                        {idx + 1}
                      </span>
                    </div>
                    <div className="flex-1 flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600 flex-shrink-0">
                        {inv.logo}
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-gray-900 group-hover:underline underline-offset-2 truncate">
                          {inv.name}
                        </p>
                        <p className="text-xs text-gray-400 truncate">
                          {inv.fund !== inv.name ? inv.fund : `Founded ${inv.founded}`}
                        </p>
                      </div>
                    </div>
                    <div className="hidden sm:block w-32 text-center">
                      <span className="inline-block text-xs bg-gray-100 text-gray-600 rounded-full px-2 py-0.5">
                        {inv.stage}
                      </span>
                    </div>
                    <div className="w-44 flex items-center gap-3 justify-end">
                      <div className="hidden sm:block flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${isTop ? 'bg-emerald-400' : 'bg-gray-300'}`}
                          style={{ width: `${width}%` }}
                        />
                      </div>
                      <span className="font-semibold text-gray-900 tabular-nums whitespace-nowrap">
                        {formatValue(value)}
                      </span>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </>
  );
}

function FilterSelect({ label, value, onChange, options }) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-harmonic-500 bg-white text-gray-700 min-w-[140px]"
      aria-label={label}
    >
      {options.map(o => (
        <option key={o} value={o}>{o}</option>
      ))}
    </select>
  );
}

