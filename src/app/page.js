import Link from 'next/link';
import { METRICS, getFilteredInvestors, getMetricBreakdown } from '@/data/investors';
import InvestorLogo from '@/components/InvestorLogo';
import BrandChip from '@/components/BrandChip';
import HeroDotGrid from '@/components/HeroDotGrid';
import { Button } from '@/components/ui/button';
import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowRight01Icon, ArrowDown01Icon } from '@hugeicons/core-free-icons';

export const metadata = {
  title: 'Investor rankings — Harmonic × UChicago',
  description:
    'Discover which VCs are most likely to help your company raise follow-on, grow faster, and reach an exit. Objective data-driven rankings for founders.',
};

import { PODIUM_GRADIENT, PODIUM_NUM_STYLE } from '@/lib/rankStyles';
import { ordinalParts } from '@/lib/insights';

function MetricSection({ metric, idx }) {
  const top3 = getFilteredInvestors({
    sortBy: metric.id,
    sortDir: 'desc',
  }).slice(0, 3);
  const formatValue = v => (metric.unit === '%' ? `${v}%` : `${v} mo`);

  return (
    <section className="px-4 sm:px-6 lg:px-10 py-12 lg:py-16 min-h-[80vh] flex items-center">
      <div className="w-full max-w-[1540px] mx-auto grid grid-cols-1 lg:grid-cols-[1fr_420px] items-center gap-10 lg:gap-6">
        {/* Left — title, description, CTA */}
        <div className="flex flex-col gap-4 lg:px-10 lg:py-4">
          <span className="inline-flex w-fit items-center px-2 py-0.5 rounded-full bg-foreground/10 ring-1 ring-foreground/15 font-mono text-[0.6875rem] font-medium tabular-nums text-foreground">
            #{idx + 1}
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl text-foreground tracking-tight leading-[1.1]">
            {metric.fullLabel}
          </h2>
          <p className="text-base/relaxed text-muted-foreground max-w-md">
            {metric.description}
          </p>
          <div className="mt-1">
            <Button asChild size="lg" variant="default">
              <Link href={`/rankings/${metric.id}`}>
                See full ranking
                <HugeiconsIcon icon={ArrowRight01Icon} strokeWidth={2} className="size-3.5" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Right — 3 stacked podium cards (gold / silver / copper) */}
        <div className="w-full lg:w-[420px] lg:h-[420px] flex flex-col gap-4">
          {top3.map((inv, idx) => {
            const breakdown = getMetricBreakdown(inv, metric.id);
            return (
              <Link
                key={inv.id}
                href={`/investors/${inv.slug}`}
                style={{ backgroundImage: PODIUM_GRADIENT[idx] }}
                className="group flex-1 min-h-[130px] flex gap-3 rounded-[28px] border border-border dark:border-white/[0.06] p-3.5 backdrop-blur-md transition-colors hover:bg-accent/30"
              >
                <div className="flex flex-1 min-w-0 flex-col justify-between p-1.5 gap-3">
                  <p
                    className="font-mono text-xl font-medium leading-none tracking-tight tabular-nums"
                    style={PODIUM_NUM_STYLE[idx]}
                  >
                    {ordinalParts(idx + 1).number}
                    <span className="text-[0.6875rem] align-top">{ordinalParts(idx + 1).suffix}</span>
                  </p>
                  <div className="min-w-0">
                    <p className="font-medium text-foreground text-base/snug truncate">
                      {inv.name}
                    </p>
                    <p className="text-xs text-muted-foreground tabular-nums truncate mt-0.5">
                      {breakdown ? `${breakdown.text} • ` : ''}
                      {formatValue(inv.metrics[metric.id])}
                    </p>
                  </div>
                </div>
                <div className="flex-shrink-0 flex items-center">
                  <InvestorLogo
                    investor={inv}
                    className="size-20 md:size-[104px] rounded-[10px] text-xl"
                  />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <div>
      <HeroDotGrid />

      {/* Hero — full viewport above the fold */}
      <section className="relative h-[calc(100vh-3.5rem)] flex items-center justify-center px-4 sm:px-6 py-10">
        <div className="relative max-w-2xl mx-auto flex flex-col items-center text-center gap-6">
          <div className="inline-flex items-center gap-2.5 rounded-[14px] bg-card/60 px-3 py-1">
            <span className="relative flex size-1">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-75" />
              <span className="relative inline-flex size-1 rounded-full bg-sky-400" />
            </span>
            <span className="text-[0.625rem] font-mono uppercase tracking-wider text-foreground">
              Real time data
            </span>
          </div>

          <h1 className="font-heading text-4xl sm:text-[2.25rem] tracking-tight leading-[1.05]">
            <span className="block text-foreground">Discover your next investor</span>
            <span className="block text-muted-foreground/70">200K+ investors, ranked.</span>
          </h1>

          <div className="flex flex-col items-center gap-2 mt-2">
            <span className="text-[0.625rem] uppercase tracking-wider text-muted-foreground">Presented by</span>
            <div className="inline-flex items-center gap-1.5 rounded-[14px] border border-border dark:border-white/[0.07] bg-card/60 pl-3.5 pr-2.5 py-2">
              <BrandChip domain="harmonic.ai" name="Harmonic" alt="Harmonic" bare />
              <span className="text-foreground/60 text-xs">×</span>
              <BrandChip domain="uchicago.edu" name="University of Chicago" alt="UChicago" bare />
            </div>
          </div>
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-8 flex flex-col items-center gap-2 text-foreground/80 animate-bounce">
          <span className="text-xs font-mono uppercase tracking-[0.15em]">Explore ranking views</span>
          <HugeiconsIcon icon={ArrowDown01Icon} strokeWidth={2.5} className="size-5" />
        </div>
      </section>

      {/* Three full-width metric sections */}
      {Object.values(METRICS).map((m, i) => (
        <MetricSection key={m.id} metric={m} idx={i} />
      ))}
    </div>
  );
}
