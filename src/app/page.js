import RankingsTable from '@/components/RankingsTable';

export const metadata = {
  title: 'Investor Rankings — Harmonic × UChicago',
  description: 'Discover which VCs are most likely to help your company raise follow-on, grow faster, and reach an exit. Objective data-driven rankings for founders.',
};

export default function HomePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Hero */}
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xs font-medium bg-harmonic-50 text-harmonic-500 border border-harmonic-100 px-3 py-1 rounded-full">
            Research Preview · May 2026
          </span>
          <span className="text-xs text-gray-400">Data finalized post-DQA</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight mb-3">
          Which VCs actually move<br className="hidden sm:block" /> the needle for founders?
        </h1>
        <p className="text-lg text-gray-500 max-w-2xl leading-relaxed">
          Objective, data-driven investor rankings built for founders — not VCs.
          Powered by Harmonic data. Methodology validated by the{' '}
          <span className="text-uchicago-maroon font-medium">University of Chicago</span>.
        </p>

        {/* Co-brand */}
        <div className="flex items-center gap-4 mt-6">
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

      {/* Stats bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Investors Ranked', value: '25+' },
          { label: 'Metrics Tracked', value: '9' },
          { label: 'Portfolio Companies', value: '50K+' },
          { label: 'Years of Data', value: '15+' },
        ].map(stat => (
          <div key={stat.label} className="bg-white border border-gray-200 rounded-xl px-4 py-3 text-center">
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Rankings table */}
      <RankingsTable />

      {/* Methodology CTA */}
      <div className="mt-12 bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-semibold text-gray-900 text-lg mb-1">How are these rankings calculated?</h2>
          <p className="text-gray-500 text-sm">Methodology co-developed with UChicago. Fully transparent, not pay-to-play.</p>
        </div>
        <a
          href="/methodology"
          className="flex-shrink-0 bg-gray-900 text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-gray-700 transition-colors"
        >
          Read the methodology →
        </a>
      </div>
    </div>
  );
}
