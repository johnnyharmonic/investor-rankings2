import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getInvestorBySlug, investors, METRICS } from '@/data/investors';
import CorrectionForm from '@/components/CorrectionForm';

export async function generateStaticParams() {
  return investors.map(inv => ({ slug: inv.slug }));
}

export async function generateMetadata({ params }) {
  const inv = getInvestorBySlug(params.slug);
  if (!inv) return {};
  return {
    title: `${inv.name} — Investor Rankings`,
    description: `${inv.name} ranks #${inv.rank} overall. Composite score: ${inv.compositeScore}/100. See all 9 performance metrics from the Harmonic × UChicago investor rankings.`,
    openGraph: {
      title: `${inv.name} · Rank #${inv.rank} | Harmonic × UChicago Investor Rankings`,
      description: `Composite score: ${inv.compositeScore}/100. Follow-on prob: ${inv.metrics.m1}%. Exit prob: ${inv.metrics.m6}%.`,
    },
  };
}

export default function InvestorPage({ params }) {
  const inv = getInvestorBySlug(params.slug);
  if (!inv) notFound();

  const score = inv.compositeScore;
  const scoreColor =
    score >= 90 ? 'text-emerald-600' :
    score >= 80 ? 'text-blue-600' :
    score >= 70 ? 'text-yellow-600' :
    'text-gray-600';

  // Peer comparison (simplified: show 3 nearby-ranked investors)
  const peers = investors
    .filter(i => i.id !== inv.id && i.stage === inv.stage)
    .slice(0, 3);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-400 mb-6 flex items-center gap-2">
        <Link href="/" className="hover:text-gray-700 transition-colors">Rankings</Link>
        <span>/</span>
        <span className="text-gray-700">{inv.name}</span>
      </nav>

      {/* Hero card */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center text-xl font-bold text-gray-600 flex-shrink-0">
              {inv.logo}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl font-bold text-gray-900">{inv.name}</h1>
                <span className="text-sm text-gray-400 bg-gray-100 rounded-full px-2 py-0.5">#{inv.rank} overall</span>
              </div>
              {inv.fund !== inv.name && <p className="text-gray-500 text-sm mt-0.5">{inv.fund}</p>}
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <Tag>{inv.stage}</Tag>
                <Tag>{inv.sector}</Tag>
                <Tag>{inv.geography}</Tag>
                <Tag>Founded {inv.founded}</Tag>
                <Tag>{inv.aum} AUM</Tag>
              </div>
              <p className="text-gray-600 text-sm mt-3 max-w-lg leading-relaxed">{inv.description}</p>
            </div>
          </div>

          <div className="sm:text-right flex-shrink-0">
            <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Composite Score</p>
            <p className={`text-5xl font-bold ${scoreColor}`}>{score}</p>
            <p className="text-xs text-gray-400 mt-1">out of 100</p>
          </div>
        </div>
      </div>

      {/* Metrics grid */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Performance Metrics</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4">
          {Object.values(METRICS).map(metric => {
            const value = inv.metrics[metric.id];
            const display = metric.unit === '%' ? `${value}%` : `${value} mo`;
            return (
              <div key={metric.id} className="bg-white border border-gray-200 rounded-xl p-4 hover:border-harmonic-500 transition-colors group">
                <div className="flex items-start justify-between mb-2">
                  <p className="text-xs font-medium text-gray-500 leading-tight pr-2">{metric.fullLabel}</p>
                  {metric.caveat && <span className="text-amber-500 text-xs flex-shrink-0" title="Higher uncertainty">⚠</span>}
                </div>
                <p className="text-2xl font-bold text-gray-900">{display}</p>
                <p className="text-xs text-gray-400 mt-2 leading-relaxed hidden group-hover:block transition-all">
                  {metric.description}
                </p>
                <p className="text-xs text-gray-400 mt-1 group-hover:hidden">
                  {metric.id.toUpperCase()} · Hover for details
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Notable portfolio */}
      {inv.notablePortfolio && inv.notablePortfolio.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Notable Portfolio Companies</h2>
          <div className="flex flex-wrap gap-2">
            {inv.notablePortfolio.map(company => (
              <span key={company} className="bg-gray-100 text-gray-700 text-sm rounded-full px-3 py-1">
                {company}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Peer comparison */}
      {peers.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Similar-Stage Investors</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {peers.map(peer => (
              <Link
                key={peer.id}
                href={`/investors/${peer.slug}`}
                className="bg-white border border-gray-200 rounded-xl p-4 hover:border-harmonic-500 transition-colors flex items-center gap-3"
              >
                <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600 flex-shrink-0">
                  {peer.logo}
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-gray-900 text-sm truncate">{peer.name}</p>
                  <p className="text-xs text-gray-400">Score: {peer.compositeScore} · #{peer.rank}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Investor CTA */}
      <div className="bg-harmonic-50 border border-harmonic-100 rounded-2xl p-6 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-semibold text-gray-900 mb-1">Are you from {inv.name}?</h2>
          <p className="text-sm text-gray-600">
            Harmonic has deeper data on your portfolio activity, deal flow, and network.
            Explore your full profile or get in touch.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 flex-shrink-0">
          <a
            href="https://harmonic.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-harmonic-500 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-harmonic-600 transition-colors text-center"
          >
            Explore Harmonic →
          </a>
        </div>
      </div>

      {/* Correction form */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Data looks wrong?</h2>
        <p className="text-sm text-gray-500 mb-4">
          Rankings are based on Harmonic's dataset. If you believe a metric is inaccurate, let us know.
        </p>
        <CorrectionForm investorName={inv.name} investorSlug={inv.slug} />
      </div>

      {/* Methodology note */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm text-gray-500">
        <p>
          <span className="font-medium text-gray-700">Methodology note:</span>{' '}
          Rankings and composite scores are calculated using Harmonic's proprietary dataset and a methodology
          co-developed with the University of Chicago. Data as of May 2026.{' '}
          <Link href="/methodology" className="text-harmonic-500 hover:underline">
            Read the full methodology →
          </Link>
        </p>
      </div>
    </div>
  );
}

function Tag({ children }) {
  return (
    <span className="text-xs bg-gray-100 text-gray-600 rounded-full px-2.5 py-0.5">
      {children}
    </span>
  );
}
