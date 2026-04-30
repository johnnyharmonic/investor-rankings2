'use client';
import { useState, useMemo } from 'react';
import Link from 'next/link';
import { investors, METRICS, STAGES, SECTORS, GEOGRAPHIES, getFilteredInvestors } from '@/data/investors';
import MetricTooltip from './MetricTooltip';

const TABLE_METRICS = ['m1', 'm2', 'm3', 'm6', 'm8'];

export default function RankingsTable() {
  const [stage, setStage] = useState('All Stages');
  const [sector, setSector] = useState('All Sectors');
  const [geography, setGeography] = useState('All Geographies');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('rank');
  const [sortDir, setSortDir] = useState('asc');

  const filtered = useMemo(() =>
    getFilteredInvestors({ stage, sector, geography, search, sortBy, sortDir }),
    [stage, sector, geography, search, sortBy, sortDir]
  );

  function handleSort(col) {
    if (sortBy === col) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(col);
      setSortDir('asc');
    }
  }

  function SortIcon({ col }) {
    if (sortBy !== col) return <span className="text-gray-300 ml-1">↕</span>;
    return <span className="text-harmonic-500 ml-1">{sortDir === 'asc' ? '↑' : '↓'}</span>;
  }

  return (
    <div>
      {/* Filters */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6 flex flex-col sm:flex-row gap-3 flex-wrap">
        {/* Search */}
        <div className="relative flex-1 min-w-[180px]">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search investors..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-harmonic-500 focus:border-transparent"
          />
        </div>

        <Select label="Stage" value={stage} onChange={setStage} options={STAGES} />
        <Select label="Sector" value={sector} onChange={setSector} options={SECTORS} />
        <Select label="Geography" value={geography} onChange={setGeography} options={GEOGRAPHIES} />

        {(stage !== 'All Stages' || sector !== 'All Sectors' || geography !== 'All Geographies' || search) && (
          <button
            onClick={() => { setStage('All Stages'); setSector('All Sectors'); setGeography('All Geographies'); setSearch(''); }}
            className="text-sm text-gray-500 hover:text-gray-800 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors whitespace-nowrap"
          >
            Clear filters
          </button>
        )}
      </div>

      <p className="text-sm text-gray-500 mb-3">
        Showing <span className="font-medium text-gray-800">{filtered.length}</span> investors · Data as of May 2026
      </p>

      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto rounded-xl border border-gray-200">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left px-4 py-3 font-medium text-gray-500 w-10">
                <button onClick={() => handleSort('rank')} className="flex items-center gap-1 hover:text-gray-900">
                  # <SortIcon col="rank" />
                </button>
              </th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Investor</th>
              <th className="text-center px-4 py-3 font-medium text-gray-500">Stage</th>
              {TABLE_METRICS.map(id => (
                <th key={id} className="text-center px-3 py-3 font-medium text-gray-500 whitespace-nowrap">
                  <button onClick={() => handleSort(id)} className="flex items-center gap-1 hover:text-gray-900 mx-auto">
                    {METRICS[id].label} <SortIcon col={id} />
                  </button>
                </th>
              ))}
              <th className="text-center px-4 py-3 font-medium text-gray-500">
                <button onClick={() => handleSort('compositeScore')} className="flex items-center gap-1 hover:text-gray-900 mx-auto">
                  Score <SortIcon col="compositeScore" />
                </button>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map((inv, idx) => (
              <tr key={inv.id} className="hover:bg-blue-50/30 transition-colors group">
                <td className="px-4 py-3 text-gray-400 font-mono text-xs">{inv.rank}</td>
                <td className="px-4 py-3">
                  <Link href={`/investors/${inv.slug}`} className="flex items-center gap-3 group-hover:underline underline-offset-2">
                    <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600 flex-shrink-0">
                      {inv.logo}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{inv.name}</p>
                      {inv.fund !== inv.name && <p className="text-xs text-gray-400">{inv.fund}</p>}
                    </div>
                  </Link>
                </td>
                <td className="px-4 py-3 text-center">
                  <span className="inline-block text-xs bg-gray-100 text-gray-600 rounded-full px-2 py-0.5">{inv.stage}</span>
                </td>
                {TABLE_METRICS.map(id => (
                  <td key={id} className="px-3 py-3 text-center">
                    <MetricTooltip metric={METRICS[id]} value={inv.metrics[id]} />
                  </td>
                ))}
                <td className="px-4 py-3 text-center">
                  <ScoreBadge score={inv.compositeScore} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <p className="text-lg mb-1">No investors found</p>
            <p className="text-sm">Try adjusting your filters</p>
          </div>
        )}
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-3">
        {filtered.map(inv => (
          <Link
            key={inv.id}
            href={`/investors/${inv.slug}`}
            className="block bg-white border border-gray-200 rounded-xl p-4 hover:border-harmonic-500 transition-colors"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-sm font-bold text-gray-600">
                  {inv.logo}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{inv.name}</p>
                  <p className="text-xs text-gray-400">{inv.stage} · {inv.geography}</p>
                </div>
              </div>
              <div className="text-right">
                <ScoreBadge score={inv.compositeScore} />
                <p className="text-xs text-gray-400 mt-1">Rank #{inv.rank}</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {TABLE_METRICS.map(id => (
                <div key={id} className="bg-gray-50 rounded-lg px-2 py-1.5 text-center">
                  <p className="text-xs text-gray-400 truncate">{METRICS[id].label}</p>
                  <p className="text-sm font-medium text-gray-800">
                    {inv.metrics[id]}{METRICS[id].unit}
                  </p>
                </div>
              ))}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

function Select({ label, value, onChange, options }) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-harmonic-500 bg-white text-gray-700 min-w-[130px]"
      aria-label={label}
    >
      {options.map(o => (
        <option key={o} value={o}>{o}</option>
      ))}
    </select>
  );
}

function ScoreBadge({ score }) {
  const color =
    score >= 90 ? 'bg-emerald-100 text-emerald-700' :
    score >= 80 ? 'bg-blue-100 text-blue-700' :
    score >= 70 ? 'bg-yellow-100 text-yellow-700' :
    'bg-gray-100 text-gray-600';

  return (
    <span className={`inline-block font-bold text-sm px-2.5 py-0.5 rounded-full ${color}`}>
      {score}
    </span>
  );
}
