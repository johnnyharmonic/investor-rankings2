import Link from 'next/link';
import { notFound } from 'next/navigation';
import { METRICS } from '@/data/investors';
import MethodologyRankingsList from '@/components/MethodologyRankingsList';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowRight01Icon } from '@hugeicons/core-free-icons';

const LOWER_IS_BETTER = new Set(['m2', 'm7']);

export async function generateStaticParams() {
  return Object.keys(METRICS).map(id => ({ methodology: id }));
}

export async function generateMetadata({ params }) {
  const metric = METRICS[params.methodology];
  if (!metric) return {};
  return {
    title: `Ranked by ${metric.fullLabel} — Investor rankings`,
    description: `Investors ranked by ${metric.fullLabel}. ${metric.description}`,
  };
}

export default function MethodologyRankingsPage({ params, searchParams }) {
  const metric = METRICS[params.methodology];
  if (!metric) notFound();

  const lowerIsBetter = LOWER_IS_BETTER.has(metric.id);

  const filterParams = new URLSearchParams();
  if (searchParams?.stage) filterParams.set('stage', searchParams.stage);
  if (searchParams?.sector) filterParams.set('sector', searchParams.sector);
  if (searchParams?.geography) filterParams.set('geography', searchParams.geography);
  const filterQs = filterParams.toString();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <header className="mb-8">
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <Badge variant="outline" className="font-mono uppercase">{metric.id}</Badge>
          {metric.caveat && (
            <Badge variant="destructive">⚠ Higher uncertainty</Badge>
          )}
          <span className="text-[0.625rem] text-muted-foreground">
            {lowerIsBetter ? 'Lower is better' : 'Higher is better'}
          </span>
        </div>
        <h1 className="font-heading text-3xl sm:text-4xl font-bold text-foreground tracking-tight mb-3">
          Ranked by {metric.fullLabel}
        </h1>
        <p className="text-sm/relaxed sm:text-base/relaxed text-muted-foreground max-w-3xl">
          {metric.description}
        </p>
      </header>

      <MethodologyRankingsList metric={metric} />

      <section className="mt-12">
        <h2 className="font-heading text-base font-semibold text-foreground mb-4">
          Explore other methodologies
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {Object.values(METRICS)
            .filter(m => m.id !== metric.id)
            .map(m => (
              <Link key={m.id} href={filterQs ? `/rankings/${m.id}?${filterQs}` : `/rankings/${m.id}`} className="group">
                <Card className="transition-colors hover:ring-foreground/20">
                  <CardContent>
                    <p className="text-[0.625rem] font-mono uppercase text-muted-foreground mb-1">
                      {m.id}
                    </p>
                    <p className="text-xs/relaxed font-medium text-foreground leading-tight">
                      {m.fullLabel}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
        </div>
      </section>

      <Card className="mt-10 bg-muted/30">
        <CardContent className="text-xs/relaxed text-muted-foreground">
          <span className="font-medium text-foreground">Methodology note:</span>{' '}
          {lowerIsBetter
            ? `For ${metric.fullLabel}, lower values are better — investors whose portfolio companies move faster rank higher.`
            : `For ${metric.fullLabel}, higher values are better.`}{' '}
          Data as of May 2026.{' '}
          <Link href="/methodology" className="text-foreground hover:underline inline-flex items-center gap-0.5">
            Read the full methodology
            <HugeiconsIcon icon={ArrowRight01Icon} strokeWidth={2} className="size-3" />
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
