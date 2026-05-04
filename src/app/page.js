import Link from 'next/link';
import { METRICS, getFilteredInvestors } from '@/data/investors';
import InvestorSearch from '@/components/InvestorSearch';

export const metadata = {
  title: 'Investor Rankings — Harmonic × UChicago',
  description: 'Discover which VCs are most likely to help your company raise follow-on, grow faster, and reach an exit. Objective data-driven rankings for founders.',
};

const METRIC_ACCENTS = {
  m1: { ring: 'hover:border-emerald-400', dot: 'bg-emerald-500', tint: 'group-hover:bg-emerald-50' },
  m2: { ring: 'hover:border-blue-400', dot: 'bg-blue-500', tint: 'group-hover:bg-blue-50' },
  m3: { ring: 'hover:border-violet-400', dot: 'bg-violet-500', tint: 'group-hover:bg-violet-50' },
  m4: { ring: 'hover:border-amber-400', dot: 'bg-amber-500', tint: 'group-hover:bg-amber-50' },
  m5: { ring: 'hover:border-rose-400', dot: 'bg-rose-500', tint: 'group-hover:bg-rose-50' },
  m6: { ring: 'hover:border-teal-400', dot: 'bg-teal-500', tint: 'group-hover:bg-teal-50' },
  m7: { ring: 'hover:border-sky-400', dot: 'bg-sky-500', tint: 'group-hover:bg-sky-50' },
  m8: { ring: 'hover:border-fuchsia-400', dot: 'bg-fuchsia-500', tint: 'group-hover:bg-fuchsia-50' },
  m9: { ring: 'hover:border-orange-400', dot: 'bg-orange-500', tint: 'group-hover:bg-orange-50' },
};

export default function HomePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero */}
      <div className="mb-12 max-w-3xl">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xs font-medium bg-harmonic-50 text-harmonic-500 border border-harmonic-100 px-3 py-1 rounded-full">
            Research Preview · May 2026
          </span>
          <span className="text-xs text-gray-400">Data finalized post-DQA</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 leading-tight mb-4 tracking-tight">
          Which VCs actually move the needle for founders?
        </h1>
        <p className="text-lg text-gray-500 leading-relaxed mb-6">
          Objective, data-driven investor rankings built for founders — not VCs.
          Powered by Harmonic data. Methodology validated by the{' '}
          <span className="text-uchicago-maroon font-medium">University of Chicago</span>.
        </p>

        {/* Search */}
        <div className="mb-6">
          <InvestorSearch />
        </div>

        {/* Co-brand */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-2">
            <div className="w-5 h-5 bg-harmonic-500 rounded flex items-center justify-center text-white text-xs font-bold">H</div>
            <span className="text-sm font-medium text-gray-700">Harmonic</span>
            <span className="text-gray-300">·</span>
            <span className="text-xs text-gray-500">Data</span>
          </div>
          <span className="text-gray-300 text-lg">×</span>
          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-2">
            <div className="w-5 h-5 bg-uchicago-maroon rounded flex items-center justify-center text-white text-xs font-bold">U</div>
            <span className="text-sm font-medium text-gray-700">UChicago</span>
            <span className="text-gray-300">·</span>
            <span className="text-xs text-gray-500">Methodology</span>
          </div>
        </div>
      </div>

      {/* Methodology cards section */}
      <div className="mb-6 flex items-end justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-1">Pick a methodology</h2>
          <p className="text-gray-500">Each card ranks investors by a single outcome metric. Click to explore.</p>
        </div>
        <Link
          href="/methodology"
          className="text-sm text-harmonic-500 hover:text-harmonic-600 font-medium whitespace-nowrap"
        >
          Read the full methodology →
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
        {Object.values(METRICS).map(m => {
          const accent = METRIC_ACCENTS[m.id] || METRIC_ACCENTS.m1;
          const top3 = getFilteredInvestors({ sortBy: m.id, sortDir: 'desc' }).slice(0, 3);
          const formatValue = v => m.unit === '%' ? `${v}%` : `${v} mo`;
          return (
            <Link
              key={m.id}
              href={`/rankings/${m.id}`}
              className={`group relative bg-white border border-gray-200 rounded-2xl p-6 transition-all hover:shadow-md hover:-translate-y-0.5 ${accent.ring}`}
            >
              <div className={`absolute inset-0 rounded-2xl transition-colors ${accent.tint}`} aria-hidden="true" />
              <div className="relative flex flex-col h-full">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${accent.dot}`} />
                    <span className="text-xs font-mono text-gray-400 uppercase tracking-wider">{m.id}</span>
                  </div>
                  {m.caveat && (
                    <span className="text-amber-500 text-xs" title="Higher uncertainty">⚠</span>
                  )}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2 leading-snug">
                  {m.fullLabel}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed mb-4 line-clamp-2">
                  {m.description}
                </p>

                <ol className="space-y-1.5 mb-4">
                  {top3.map((inv, idx) => (
                    <li key={inv.id} className="flex items-center gap-2.5 text-sm">
                      <span className="w-4 text-xs font-mono text-gray-400 tabular-nums flex-shrink-0">
                        {idx + 1}
                      </span>
                      <span className="w-6 h-6 rounded-md bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-600 flex-shrink-0">
                        {inv.logo}
                      </span>
                      <span className="font-medium text-gray-800 truncate flex-1 min-w-0">
                        {inv.name}
                      </span>
                      <span className="text-gray-900 font-semibold tabular-nums whitespace-nowrap">
                        {formatValue(inv.metrics[m.id])}
                      </span>
                    </li>
                  ))}
                </ol>

                <div className="mt-auto flex items-center justify-between pt-3 border-t border-gray-100">
                  <span className="text-xs text-gray-400">Top 3 of 25</span>
                  <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors">
                    See full ranking →
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Footer note */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-semibold text-gray-900 text-lg mb-1">219,000+ investors · 9 metrics · 50K+ portfolio companies</h2>
          <p className="text-gray-500 text-sm">Methodology co-developed with UChicago. Fully transparent, not pay-to-play.</p>
        </div>
        <Link
          href="/methodology"
          className="flex-shrink-0 bg-gray-900 text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-gray-700 transition-colors"
        >
          How it works →
        </Link>
      </div>
    </div>
  );
}
