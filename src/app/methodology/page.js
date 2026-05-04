import Link from 'next/link';
import { METRICS } from '@/data/investors';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowRight01Icon, Alert02Icon } from '@hugeicons/core-free-icons';

export const metadata = {
  title: 'Methodology — Investor rankings',
  description: 'How we rank venture capital investors. Methodology co-developed by Harmonic and the University of Chicago Booth School of Business.',
};

export default function MethodologyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <nav className="text-xs text-muted-foreground mb-6 flex items-center gap-2">
        <Link href="/" className="hover:text-foreground transition-colors">Rankings</Link>
        <span>/</span>
        <span className="text-foreground">Methodology</span>
      </nav>

      <header className="mb-10">
        <h1 className="font-heading text-3xl sm:text-4xl font-bold text-foreground tracking-tight mb-3">
          How we rank investors
        </h1>
        <p className="text-sm/relaxed sm:text-base/relaxed text-muted-foreground">
          Our methodology is fully transparent, academically validated, and non-commercial.
          No fund has paid to appear — or to rank higher.
        </p>
        <div className="flex items-center gap-3 mt-5 flex-wrap">
          <div className="inline-flex items-center gap-2 rounded-full bg-muted px-3 py-1.5">
            <div className="w-3.5 h-3.5 bg-harmonic-500 rounded flex items-center justify-center text-white text-[0.5rem] font-bold">H</div>
            <span className="text-[0.625rem] font-medium text-foreground">Harmonic — Data</span>
          </div>
          <span className="text-muted-foreground">×</span>
          <div className="inline-flex items-center gap-2 rounded-full bg-muted px-3 py-1.5">
            <div className="w-3.5 h-3.5 bg-uchicago-maroon rounded flex items-center justify-center text-white text-[0.5rem] font-bold">U</div>
            <span className="text-[0.625rem] font-medium text-foreground">UChicago — Methodology</span>
          </div>
        </div>
      </header>

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

      <Section title="Data sources">
        <p>
          All data is sourced from Harmonic's proprietary dataset, which aggregates information from public
          filings, company registries, press releases, and other structured sources. The dataset covers:
        </p>
        <ul className="mt-3 space-y-1.5 text-muted-foreground list-disc pl-5">
          <li>Financing rounds (deal size, round type, date, participants)</li>
          <li>Post-money valuations (estimated where not publicly disclosed)</li>
          <li>Exit events (IPO, M&A, acqui-hire)</li>
          <li>Investor participation across rounds</li>
          <li>Company lifecycle milestones</li>
        </ul>
        <Card className="mt-4 bg-amber-50 ring-amber-200/50 dark:bg-amber-950/20">
          <CardContent className="flex gap-3">
            <HugeiconsIcon icon={Alert02Icon} strokeWidth={2} className="size-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <p className="text-xs/relaxed text-amber-900 dark:text-amber-200">
              <span className="font-semibold">Valuation data caveat:</span>{' '}
              Post-money valuations are estimated for a significant portion of rounds where official figures
              are not disclosed. Estimates carry a higher error rate and should be interpreted with caution.
              Metric M5 (Valuation step-up rate) is flagged accordingly.
            </p>
          </CardContent>
        </Card>
      </Section>

      <Section title="The 9 metrics">
        <div className="space-y-3">
          {Object.values(METRICS).map(m => (
            <Card key={m.id} className="hover:ring-foreground/20 transition-colors">
              <CardContent>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <Badge variant="outline" className="font-mono uppercase">{m.id}</Badge>
                      <span className="font-semibold text-sm text-foreground">{m.fullLabel}</span>
                      {m.caveat && (
                        <span className="text-[0.625rem] text-amber-600 inline-flex items-center gap-0.5">
                          <HugeiconsIcon icon={Alert02Icon} strokeWidth={2} className="size-3" />
                          Higher uncertainty
                        </span>
                      )}
                    </div>
                    <p className="text-xs/relaxed text-muted-foreground">{m.description}</p>
                  </div>
                  <Badge variant="secondary" className="flex-shrink-0">
                    {m.unit === '%' ? 'Percentage' : 'Months'}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>

      <Section title="Composite score">
        <p>
          The composite score (0–100) is a weighted average of the 9 metrics. Metrics are normalized to a
          0–100 scale relative to the distribution of all investors in the dataset. Weights are set by the
          UChicago research team and will be published in their forthcoming academic paper.
        </p>
        <p className="mt-3">
          For directional metrics (M2 Financing velocity, M7 Time to exit), lower values are better —
          meaning investors whose portfolio companies move faster are ranked higher.
        </p>
      </Section>

      <Section title="Coverage & eligibility">
        <p>
          An investor must meet a minimum portfolio coverage threshold to appear in the rankings.
          This ensures statistical reliability. Investors with very small or obscure portfolios are
          excluded to avoid misleading scores from small sample sizes.
        </p>
        <p className="mt-3 text-xs italic">
          Exact thresholds are TBD and will be finalized with UChicago before publication.
        </p>
      </Section>

      <Section title="Update cadence">
        <p>
          Rankings are updated after each major Harmonic DQA (data quality assurance) cycle. The current
          dataset reflects activity through May 2026. Rankings may change modestly between updates as
          new data is ingested and historical records are corrected.
        </p>
      </Section>

      <Section title="What these rankings are not">
        <ul className="space-y-2 list-disc pl-5">
          <li><span className="font-semibold text-foreground">Not pay-to-play.</span> No fund has paid to be included or to improve their ranking.</li>
          <li><span className="font-semibold text-foreground">Not reputation-based.</span> Rankings are derived from outcome data, not surveys or brand perception.</li>
          <li><span className="font-semibold text-foreground">Not comprehensive.</span> Only investors with sufficient Harmonic data coverage are included.</li>
          <li><span className="font-semibold text-foreground">Not investment advice.</span> Rankings are informational and should not be the sole basis for fundraising decisions.</li>
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
            "Submit correction" button on the relevant investor profile page.
            Our team reviews all submissions.
          </FAQ>
          <FAQ q="Who is UChicago's role in this?">
            The University of Chicago designed and peer-reviewed the statistical methodology, ensuring
            the metrics are well-defined and the scoring is academically rigorous. Harmonic provides
            the underlying data.
          </FAQ>
        </div>
      </Section>

      <Card className="mt-10 bg-muted/30">
        <CardContent className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-heading font-semibold text-sm text-foreground mb-1">Ready to explore the rankings?</h3>
            <p className="text-xs text-muted-foreground">See how investors compare across all 9 metrics.</p>
          </div>
          <Button asChild size="lg">
            <Link href="/">
              View rankings
              <HugeiconsIcon icon={ArrowRight01Icon} strokeWidth={2} />
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <section className="mb-10">
      <h2 className="font-heading text-lg font-semibold text-foreground mb-4 pb-2 border-b border-border">
        {title}
      </h2>
      <div className="text-sm/relaxed text-muted-foreground">{children}</div>
    </section>
  );
}

function FAQ({ q, children }) {
  return (
    <div>
      <p className="text-sm font-semibold text-foreground mb-1">{q}</p>
      <p className="text-xs/relaxed text-muted-foreground">{children}</p>
    </div>
  );
}
