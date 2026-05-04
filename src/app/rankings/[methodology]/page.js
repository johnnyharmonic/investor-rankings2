import Link from 'next/link';
import { notFound } from 'next/navigation';
import { METRICS } from '@/data/investors';
import MethodologyRankingsList from '@/components/MethodologyRankingsList';

const LOWER_IS_BETTER = new Set(['m2', 'm7']);

export async function generateStaticParams() {
  return Object.keys(METRICS).map(id => ({ methodology: id }));
}

export async function generateMetadata({ params }) {
  const metric = METRICS[params.methodology];
  if (!metric) return {};
  return {
    title: `Ranked by ${metric.fullLabel} — Investor Rankings`,
    description: `Investors ranked by ${metric.fullLabel}. ${metric.description}`,
  };
}

export default function MethodologyRankingsPage({ params }) {
  const metric = METRICS[params.methodology];
  if (!metric) notFound();

  const lowerIsBetter = LOWER_IS_BETTER.has(metric.id);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-400 mb-6 flex items-center gap-2">
        <Link href="/" className="hover:text-gray-700 transition-colors">Methodologies</Link>
        <span>/</span>
        <span className="text-gray-700">{metric.fullLabel}</span>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs font-mono bg-gray-100 text-gray-500 px-2 py-0.5 rounded uppercase">
            {metric.id}
          </span>
          {metric.caveat && (
            <span className="text-xs text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
              ⚠ Higher uncertainty
            </span>
          )}
          <span className="text-xs text-gray-400">
            {lowerIsBetter ? 'Lower is better' : 'Higher is better'}
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3 tracking-tight">
          Ranked by {metric.fullLabel}
        </h1>
        <p className="text-gray-500 text-lg leading-relaxed max-w-3xl">
          {metric.description}
        </p>
      </div>

      <MethodologyRankingsList metric={metric} />

      {/* Other methodologies */}
      <div className="mt-12">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Explore other methodologies</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {Object.values(METRICS)
            .filter(m => m.id !== metric.id)
            .map(m => (
              <Link
                key={m.id}
                href={`/rankings/${m.id}`}
                className="bg-white border border-gray-200 rounded-xl p-3 hover:border-harmonic-500 transition-colors"
              >
                <p className="text-xs font-mono text-gray-400 uppercase mb-1">{m.id}</p>
                <p className="text-sm font-medium text-gray-900 leading-tight">{m.fullLabel}</p>
              </Link>
            ))}
        </div>
      </div>

      {/* Methodology link */}
      <div className="mt-10 bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm text-gray-500">
        <p>
          <span className="font-medium text-gray-700">Methodology note:</span>{' '}
          {lowerIsBetter
            ? `For ${metric.fullLabel}, lower values are better — investors whose portfolio companies move faster rank higher.`
            : `For ${metric.fullLabel}, higher values are better.`}{' '}
          Data as of May 2026.{' '}
          <Link href="/methodology" className="text-harmonic-500 hover:underline">
            Read the full methodology →
          </Link>
        </p>
      </div>
    </div>
  );
}
