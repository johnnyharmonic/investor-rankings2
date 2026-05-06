import Link from 'next/link';
import { METRICS, getFilteredInvestors } from '@/data/investors';
import InvestorSearch from '@/components/InvestorSearch';
import InvestorLogo from '@/components/InvestorLogo';
import BrandChip from '@/components/BrandChip';
import HeroDotGrid from '@/components/HeroDotGrid';
import MethodologyFilters from '@/components/MethodologyFilters';
import { parseFilterValues } from '@/lib/filters';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { RANK_GRADIENT, RANK_NUM_COLOR } from '@/lib/rankStyles';
import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowRight01Icon } from '@hugeicons/core-free-icons';

export const metadata = {
  title: 'Investor rankings — Harmonic × UChicago',
  description:
    'Discover which VCs are most likely to help your company raise follow-on, grow faster, and reach an exit. Objective data-driven rankings for founders.',
};

export default function HomePage({ searchParams }) {
  const stages = parseFilterValues(searchParams?.stage);
  const sectors = parseFilterValues(searchParams?.sector);
  const geographies = parseFilterValues(searchParams?.geography);

  const filterParams = new URLSearchParams();
  if (stages.length) filterParams.set('stage', stages.join(','));
  if (sectors.length) filterParams.set('sector', sectors.join(','));
  if (geographies.length) filterParams.set('geography', geographies.join(','));
  const filterQs = filterParams.toString();

  return (
    <div>
      {/* Hero */}
      <section className="hero-bg px-4 sm:px-6 pt-16 pb-20 sm:pt-24 sm:pb-28">
        <HeroDotGrid />
        <div className="max-w-2xl mx-auto flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2.5 rounded-full ring-1 ring-foreground/10 bg-card/40 px-2.5 py-1 mb-7">
            <span className="relative flex size-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-75" />
              <span className="relative inline-flex size-1.5 rounded-full bg-sky-400" />
            </span>
            <span className="text-[0.625rem] font-mono uppercase tracking-wider text-muted-foreground">
              Real time data
            </span>
          </div>

          <h1 className="font-heading text-4xl sm:text-5xl tracking-tight leading-[1.05] mb-3">
            <span className="block text-foreground">Find your next investor</span>
            <span className="block text-muted-foreground/70">200K+ investors, ranked.</span>
          </h1>

          <div className="w-full max-w-xl mt-8">
            <InvestorSearch />
          </div>

          <div className="mt-12 flex flex-col items-center gap-3">
            <span className="text-[0.625rem] uppercase tracking-wider text-muted-foreground">
              Presented by
            </span>
            <div className="inline-flex items-center gap-3">
              <BrandChip domain="harmonic.ai" name="Harmonic" alt="Harmonic" />
              <span className="text-muted-foreground text-xs">×</span>
              <BrandChip domain="uchicago.edu" name="University of Chicago" alt="UChicago" />
            </div>
          </div>
        </div>
      </section>

      {/* Explore investors */}
      <section className="px-4 sm:px-6 pb-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-6">
            <div className="flex flex-col items-center mb-1.5">
              <h2 className="font-heading text-2xl sm:text-3xl font-medium text-foreground tracking-tight mb-1.5">
                <span className="block">Explore top investors</span>
                <span className="block text-muted-foreground">based on objective data</span>
              </h2>
            </div>

          </div>

          <div className="flex flex-col items-center justify-center gap-2 mb-8">
            <MethodologyFilters />
            <p className="text-xs/relaxed text-muted-foreground">
              Apply filters to narrow down investors by focus areas. 
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.values(METRICS).map(m => {
              const filtered = getFilteredInvestors({
                stage: stages,
                sector: sectors,
                geography: geographies,
                sortBy: m.id,
                sortDir: 'desc',
              });
              const top3 = filtered.slice(0, 3);
              const formatValue = v => (m.unit === '%' ? `${v}%` : `${v} mo`);
              const href = filterQs ? `/rankings/${m.id}?${filterQs}` : `/rankings/${m.id}`;
              return (
                <Card key={m.id} className="gap-0 py-0 transition-colors rounded-[28px]">
                  <div className="px-5 pt-5 pb-5">
                    <h3 className="font-heading text-base font-semibold text-foreground leading-snug mb-1.5">
                      {m.fullLabel}
                    </h3>
                    <p className="text-xs/relaxed text-muted-foreground">
                      {m.description}
                    </p>
                  </div>

                  <div className="px-3">
                    {top3.length === 0 ? (
                      <p className="text-xs text-muted-foreground py-6 text-center">
                        No investors match these filters.
                      </p>
                    ) : (
                      <ol className="space-y-2">
                        {top3.map((inv, idx) => (
                          <li key={inv.id}>
                            <Link
                              href={`/investors/${inv.slug}`}
                              style={{ backgroundImage: RANK_GRADIENT[idx] }}
                              className="flex items-center gap-3 px-4 py-2.5 rounded-2xl ring-1 ring-foreground/5 hover:bg-accent/40 transition-colors"
                            >
                              <span className={`w-4 text-xs font-semibold tabular-nums flex-shrink-0 ${RANK_NUM_COLOR[idx]}`}>
                                {idx + 1}.
                              </span>
                              <InvestorLogo
                                investor={inv}
                                className="w-7 h-7 rounded-md text-[0.6rem] flex-shrink-0"
                              />
                              <span className="font-medium text-foreground text-sm/snug truncate flex-1 min-w-0">
                                {inv.name}
                              </span>
                              <span className="font-semibold text-foreground tabular-nums text-sm whitespace-nowrap">
                                {formatValue(inv.metrics[m.id])}
                              </span>
                            </Link>
                          </li>
                        ))}
                      </ol>
                    )}
                  </div>

                  <div className="py-4 pl-5 pr-3 flex items-center justify-between gap-3">
                    <span className="text-[0.6875rem] text-muted-foreground tabular-nums">
                      Top {top3.length} of 25
                    </span>
                    <Button asChild size="sm" variant="secondary" className="h-8">
                      <Link href={href}>
                        See full ranking
                        <HugeiconsIcon
                          icon={ArrowRight01Icon}
                          strokeWidth={2}
                          className="size-3"
                        />
                      </Link>
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Bottom CTA banner */}
      <section className="px-4 sm:px-6 pb-20">
        <div className="max-w-6xl mx-auto">
          <Card className="rounded-[28px] p-4">
            <CardContent className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <p className="font-heading font-semibold text-foreground text-sm mb-1">
                  A co-published, data-driven ranking of 200K+ investors
                </p>
                <p className="text-xs text-muted-foreground">Powered by Harmonic data</p>
              </div>
              <Button asChild size="lg" variant="secondary">
                <Link href="/methodology">
                  Learn more
                  <HugeiconsIcon icon={ArrowRight01Icon} strokeWidth={2} className="size-3" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
