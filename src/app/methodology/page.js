import Link from 'next/link';
import { METRICS } from '@/data/investors';

export const metadata = {
  title: 'Methodology — Investor Rankings',
  description: 'How we rank venture capital investors. Methodology co-developed by Harmonic and the University of Chicago Booth School of Business.',
};

export default function MethodologyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-400 mb-6 flex items-center gap-2">
        <Link href="/" className="hover:text-gray-700">Rankings</Link>
        <span>/</span>
        <span className="text-gray-700">Methodology</span>
      </nav>

      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">How we rank investors</h1>
        <p className="text-gray-500 text-lg leading-relaxed">
          Our methodology is fully transparent, academically validated, and non-commercial.
          No fund has paid to appear — or to rank higher.
        </p>
        <div className="flex items-center gap-3 mt-5">
          <div className="flex items-center gap-2 bg-gray-100 rounded-full px-3 py-1.5">
            <div className="w-4 h-4 bg-harmonic-500 rounded flex items-center justify-center text-white text-xs font-bold">H</div>
            <span className="text-xs font-medium text-gray-700">Harmonic — Data</span>
          </div>
          <span className="text-gray-300">×</span>
          <div className="flex items-center gap-2 bg-gray-100 rounded-full px-3 py-1.5">
            <div className="w-4 h-4 bg-uchicago-maroon rounded flex items-center justify-center text-white text-xs font-bold">U</div>
            <span className="text-xs font-medium text-gray-700">UChicago — Methodology</span>
          </div>
        </div>
      </div>

      <Section title="Overview">
        <p>
          The rankings are built on Harmonic's dataset of venture financing activity across tens of thousands
          of companies and investors. The University of Chicago designed and validated the statistical methodology,
          ensuring the metrics are robust, reproducible, and not gameable.
        </p>
        <p className="mt-3">
          Each investor is evaluated across 9 outcome-based metrics (M1–M9). These are then combined into
          a composite score (0–100) using a weighted average, with weights determined by the UChicago team
          based on their relevance to founder outcomes.
        </p>
      </Section>

      <Section title="Data Sources">
        <p>
          All data is sourced from Harmonic's proprietary dataset, which aggregates information from public
          filings, company registries, press releases, and other structured sources. The dataset covers:
        </p>
        <ul className="mt-3 space-y-2 text-gray-600 text-sm list-disc pl-5">
          <li>Financing rounds (deal size, round type, date, participants)</li>
          <li>Post-money valuations (estimated where not publicly disclosed)</li>
          <li>Exit events (IPO, M&A, acqui-hire)</li>
          <li>Investor participation across rounds</li>
          <li>Company lifecycle milestones</li>
        </ul>
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-4 text-sm text-amber-800">
          <strong>Valuation data caveat:</strong> Post-money valuations are estimated for a significant
          portion of rounds where official figures are not disclosed. Estimates carry a higher error rate
          and should be interpreted with caution. Metric M5 (Valuation Step-up Rate) is flagged accordingly.
        </div>
      </Section>

      <Section title="The 9 Metrics">
        <div className="space-y-4">
          {Object.values(METRICS).map(m => (
            <div key={m.id} className="border border-gray-200 rounded-xl p-4 hover:border-harmonic-500 transition-colors">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono bg-gray-100 text-gray-500 px-2 py-0.5 rounded">{m.id.toUpperCase()}</span>
                    <span className="font-semibold text-gray-900">{m.fullLabel}</span>
                    {m.caveat && <span className="text-amber-500 text-xs">⚠ Higher uncertainty</span>}
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">{m.description}</p>
                </div>
                <span className="text-xs text-gray-400 flex-shrink-0 bg-gray-50 border border-gray-200 rounded px-2 py-1">
                  {m.unit === '%' ? 'Percentage' : 'Months'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Composite Score">
        <p>
          The composite score (0–100) is a weighted average of the 9 metrics. Metrics are normalized to a
          0–100 scale relative to the distribution of all investors in the dataset. Weights are set by the
          UChicago research team and will be published in their forthcoming academic paper.
        </p>
        <p className="mt-3">
          For directional metrics (M2 Financing Velocity, M7 Time to Exit), lower values are better —
          meaning investors whose portfolio companies move faster are ranked higher.
        </p>
      </Section>

      <Section title="Coverage & Eligibility">
        <p>
          An investor must meet a minimum portfolio coverage threshold to appear in the rankings.
          This ensures statistical reliability. Investors with very small or obscure portfolios are
          excluded to avoid misleading scores from small sample sizes.
        </p>
        <p className="mt-3 text-sm text-gray-500 italic">
          Exact thresholds are TBD and will be finalized with UChicago before publication.
        </p>
      </Section>

      <Section title="Update Cadence">
        <p>
          Rankings are updated after each major Harmonic DQA (data quality assurance) cycle. The current
          dataset reflects activity through May 2026. Rankings may change modestly between updates as
          new data is ingested and historical records are corrected.
        </p>
      </Section>

      <Section title="What these rankings are NOT">
        <ul className="space-y-2 text-sm text-gray-600 list-disc pl-5">
          <li><strong>Not pay-to-play.</strong> No fund has paid to be included or to improve their ranking.</li>
          <li><strong>Not reputation-based.</strong> Rankings are derived from outcome data, not surveys or brand perception.</li>
          <li><strong>Not comprehensive.</strong> Only investors with sufficient Harmonic data coverage are included.</li>
          <li><strong>Not investment advice.</strong> Rankings are informational and should not be the sole basis for fundraising decisions.</li>
        </ul>
      </Section>

      <Section title="FAQs">
        <div className="space-y-5">
          <FAQ q="Why isn't [Fund X] on this list?">
            An investor may be absent because they don't meet the minimum portfolio coverage threshold,
            or because their deal activity is not sufficiently captured in Harmonic's dataset.
            Coverage will expand over time.
          </FAQ>
          <FAQ q="Why does [Metric] matter to me as a founder?">
            Each metric is designed to proxy something a founder cares about: Will this investor help
            me raise my next round? How quickly? Will they follow on? What's my probability of exiting?
            Taken together, the 9 metrics give a multi-dimensional picture of investor quality.
          </FAQ>
          <FAQ q="Can I correct data about my fund?">
            Yes. If you believe any data in the rankings is inaccurate, please use the
            "Dispute this data" button on the relevant investor profile page.
            Our team reviews all submissions.
          </FAQ>
          <FAQ q="Who is UChicago's role in this?">
            The University of Chicago designed and peer-reviewed the statistical methodology, ensuring
            the metrics are well-defined and the scoring is academically rigorous. Harmonic provides
            the underlying data.
          </FAQ>
        </div>
      </Section>

      <div className="mt-10 bg-harmonic-50 border border-harmonic-100 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-semibold text-gray-900 mb-1">Ready to explore the rankings?</h3>
          <p className="text-sm text-gray-600">See how investors compare across all 9 metrics.</p>
        </div>
        <Link
          href="/"
          className="flex-shrink-0 bg-harmonic-500 text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-harmonic-600 transition-colors"
        >
          View Rankings →
        </Link>
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <section className="mb-10">
      <h2 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">{title}</h2>
      <div className="text-gray-600 text-sm leading-relaxed">{children}</div>
    </section>
  );
}

function FAQ({ q, children }) {
  return (
    <div>
      <p className="font-medium text-gray-800 mb-1">{q}</p>
      <p className="text-gray-600 text-sm leading-relaxed">{children}</p>
    </div>
  );
}
