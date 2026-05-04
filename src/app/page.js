import Link from 'next/link';
import { METRICS, getFilteredInvestors } from '@/data/investors';
import InvestorSearch from '@/components/InvestorSearch';
import InvestorLogo from '@/components/InvestorLogo';
import BrandChip from '@/components/BrandChip';
import MethodologyFilters, { parseFilterValues } from '@/components/MethodologyFilters';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowRight01Icon, Alert02Icon } from '@hugeicons/core-free-icons';

export const metadata = {
  title: 'Investor rankings — Harmonic × UChicago',
  description: 'Discover which VCs are most likely to help your company raise follow-on, grow faster, and reach an exit. Objective data-driven rankings for founders.',
};

const METRIC_DOTS = {
  m1: 'bg-emerald-500',
  m2: 'bg-blue-500',
  m3: 'bg-violet-500',
  m4: 'bg-amber-500',
  m5: 'bg-rose-500',
  m6: 'bg-teal-500',
  m7: 'bg-sky-500',
  m8: 'bg-fuchsia-500',
  m9: 'bg-orange-500',
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero */}
      <section className="mb-14 max-w-3xl">
        <div className="flex items-center gap-3 mb-5 flex-wrap">
          <Badge variant="outline" className="gap-1.5 pl-2">
            <span className="relative flex size-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
              <span className="relative inline-flex size-1.5 rounded-full bg-emerald-500" />
            </span>
            Real time data
          </Badge>
          <span className="text-[0.625rem] text-muted-foreground">Last updated May 4, 2026</span>
        </div>
        <h1 className="font-heading text-4xl sm:text-5xl font-bold leading-[1.1] mb-4 tracking-tight">
          <span className="block text-foreground">Investor rankings</span>
          <span className="block text-muted-foreground/60">Objective, data-driven</span>
        </h1>
        <p className="text-sm/relaxed sm:text-base/relaxed text-muted-foreground mb-5 max-w-2xl">
          Compare 200K+ investors across 9 outcome metrics.
        </p>

        <div className="flex items-center gap-3 mb-7 flex-wrap">
          <BrandChip domain="uchicago.edu" name="University of Chicago" alt="UChicago" />
          <span className="text-muted-foreground">×</span>
          <BrandChip domain="harmonic.ai" name="Harmonic" alt="Harmonic" />
        </div>

        <InvestorSearch />
      </section>

      {/* Methodology cards */}
      <section className="mb-12">
        <div className="mb-6 flex items-end justify-between gap-4 flex-wrap">
          <div>
            <h2 className="font-heading text-2xl font-semibold text-foreground tracking-tight mb-1">
              Pick a methodology
            </h2>
            <p className="text-sm text-muted-foreground">
              Each card ranks investors by a single outcome metric. Click to explore.
            </p>
          </div>
          <Button asChild variant="link" size="sm">
            <Link href="/methodology">
              Learn more
              <HugeiconsIcon icon={ArrowRight01Icon} strokeWidth={2} />
            </Link>
          </Button>
        </div>

        <MethodologyFilters />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.values(METRICS).map(m => {
            const filtered = getFilteredInvestors({ stage: stages, sector: sectors, geography: geographies, sortBy: m.id, sortDir: 'desc' });
            const top3 = filtered.slice(0, 3);
            const formatValue = v => m.unit === '%' ? `${v}%` : `${v} mo`;
            const href = filterQs ? `/rankings/${m.id}?${filterQs}` : `/rankings/${m.id}`;
            return (
              <Link key={m.id} href={href} className="group block">
                <Card className="h-full py-0 gap-0 transition-all hover:ring-foreground/20 hover:-translate-y-0.5 hover:shadow-sm">
                  <CardHeader className="border-b pt-5 pb-5">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className={`w-1.5 h-1.5 rounded-full ${METRIC_DOTS[m.id]}`} />
                        <span className="text-[0.625rem] font-mono uppercase tracking-wider text-muted-foreground">
                          {m.id}
                        </span>
                      </div>
                      {m.caveat && (
                        <HugeiconsIcon
                          icon={Alert02Icon}
                          strokeWidth={2}
                          className="size-3 text-amber-500"
                        />
                      )}
                    </div>
                    <CardTitle className="text-base leading-snug font-semibold">
                      {m.fullLabel}
                    </CardTitle>
                    <CardDescription className="line-clamp-2">
                      {m.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="py-5">
                    {top3.length === 0 ? (
                      <p className="text-xs text-muted-foreground py-2">
                        No investors match these filters.
                      </p>
                    ) : (
                      <ol className="space-y-1.5">
                        {top3.map((inv, idx) => (
                          <li key={inv.id} className="flex items-center gap-2 text-xs/relaxed">
                            <span className="w-3 text-[0.625rem] font-mono tabular-nums text-muted-foreground flex-shrink-0">
                              {idx + 1}
                            </span>
                            <InvestorLogo investor={inv} className="w-5 h-5 rounded text-[0.5rem]" />
                            <span className="font-medium text-foreground truncate flex-1 min-w-0">
                              {inv.name}
                            </span>
                            <span className="font-semibold text-foreground tabular-nums whitespace-nowrap">
                              {formatValue(inv.metrics[m.id])}
                            </span>
                          </li>
                        ))}
                      </ol>
                    )}
                  </CardContent>

                  <CardFooter className="border-t pt-5 pb-5 justify-between">
                    <span className="text-[0.625rem] text-muted-foreground">
                      Top {top3.length} of {filtered.length}
                    </span>
                    <span className="text-xs/relaxed font-medium text-foreground inline-flex items-center gap-1 group-hover:gap-1.5 transition-all">
                      See full ranking
                      <HugeiconsIcon icon={ArrowRight01Icon} strokeWidth={2} className="size-3" />
                    </span>
                  </CardFooter>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Footer banner */}
      <Card>
        <CardContent className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-2">
          <div>
            <p className="font-heading font-semibold text-foreground text-sm mb-1">
              200K+ investors · 9 metrics · 10M+ portfolio companies
            </p>
            <p className="text-xs text-muted-foreground">
              Methodology co-developed with UChicago. Fully transparent, not pay-to-play.
            </p>
          </div>
          <Button asChild size="lg">
            <Link href="/methodology">
              How it works
              <HugeiconsIcon icon={ArrowRight01Icon} strokeWidth={2} />
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
