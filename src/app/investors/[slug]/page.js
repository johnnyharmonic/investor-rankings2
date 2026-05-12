import { notFound } from 'next/navigation';
import { getInvestorBySlug, investors, METRICS, getMetricBreakdown } from '@/data/investors';
import { getInsights, scopeLabel } from '@/lib/insights';
import { typeShort, typeTint, stageTint, sectorTint } from '@/lib/sectorColors';
import CorrectionForm from '@/components/CorrectionForm';
import InvestorLogo from '@/components/InvestorLogo';
import LogoGlow from '@/components/LogoGlow';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { HugeiconsIcon } from '@hugeicons/react';
import { Linkedin01Icon } from '@hugeicons/core-free-icons';

export async function generateStaticParams() {
  return investors.map(inv => ({ slug: inv.slug }));
}

export async function generateMetadata({ params }) {
  const inv = getInvestorBySlug(params.slug);
  if (!inv) return {};
  return {
    title: `${inv.name} — Investor rankings`,
    description: `${inv.name}'s ranking across performance metrics. From the Harmonic × UChicago investor rankings.`,
    openGraph: {
      title: `${inv.name} | Harmonic × UChicago investor rankings`,
      description: `Performance metrics and insights for ${inv.name}.`,
    },
  };
}

export default function InvestorPage({ params }) {
  const inv = getInvestorBySlug(params.slug);
  if (!inv) notFound();

  const insights = getInsights(inv);

  return (
    <div className="relative isolate max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10 py-[120px]">
      <LogoGlow investor={inv}/>
      {/* Header */}
      <header className="flex items-start justify-between gap-4 flex-wrap mb-4">
        <div className="flex items-center gap-3 min-w-0">
          <InvestorLogo investor={inv} className="w-10 h-10 rounded-lg text-sm flex-shrink-0" />
          <h1 className="font-heading text-3xl sm:text-4xl font-medium text-foreground tracking-tight truncate">
            {inv.name}
          </h1>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <Button asChild variant="outline" size="icon-lg" aria-label="LinkedIn">
            <a
              href={`https://www.linkedin.com/company/${inv.slug}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <HugeiconsIcon icon={Linkedin01Icon} strokeWidth={2} />
            </a>
          </Button>
          {inv.domain && (
            <Button asChild variant="outline" size="lg">
              <a
                href={`https://${inv.domain}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Visit site
              </a>
            </Button>
          )}
        </div>
      </header>

      {inv.description && (
        <p className="text-sm text-muted-foreground mb-4 max-w-3xl">{inv.description}</p>
      )}

      <div className="flex items-center gap-1.5 flex-wrap mb-20">
        <ProfilePill label={typeShort(inv.primaryType)} title={inv.primaryType} tint={typeTint(inv.primaryType)} />
        <ProfilePill label={inv.stage} tint={stageTint(inv.stage)} />
        <ProfilePill label={inv.sector} tint={sectorTint(inv.sector)} />
        <ProfilePill label={inv.geography} tint="bg-violet-500/10 text-violet-700 dark:text-violet-300 ring-violet-500/20" />
      </div>

      {/* Insights */}
      {insights.length > 0 && (
        <section className="mb-10">
          <h2 className="font-heading text-2xl font-medium text-foreground mb-4">Insights</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {insights.map((ins, i) => {
              const metric = METRICS[ins.metricId];
              return (
                <Card key={i} className="bg-surface-raised rounded-[28px] justify-start min-h-[180px]">
                  <CardContent>
                    <p className="font-heading text-lg font-medium text-foreground leading-snug mb-1.5">
                      Ranked #{ins.rank} in {metric.fullLabel}
                    </p>
                    <p className="text-xs text-muted-foreground">{scopeLabel(ins.combo)}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>
      )}

      {/* Performance metrics */}
      <section className="mb-10">
        <h2 className="font-heading text-2xl font-medium text-foreground mb-4">Performance metrics</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {Object.values(METRICS).map(metric => {
            const value = inv.metrics[metric.id];
            const display = metric.unit === '%' ? `${value}%` : `${value} mo`;
            const breakdown = getMetricBreakdown(inv, metric.id);
            return (
              <Card key={metric.id} className="bg-surface-raised rounded-[28px] min-h-[180px]">
                <CardContent className="flex flex-col h-full justify-between gap-4">
                  <p className="text-xs text-muted-foreground">{metric.fullLabel}</p>
                  <div>
                    <p className="font-heading text-3xl font-bold text-foreground tabular-nums leading-none mb-1.5">
                      {display}
                    </p>
                    {breakdown && (
                      <p className="text-xs text-muted-foreground tabular-nums">{breakdown.text}</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Correction banner */}
      <Card className="bg-surface-raised rounded-[28px]">
        <CardContent className="flex items-center justify-between gap-4 flex-wrap">
          <div className="min-w-0">
            <p className="text-sm font-medium text-foreground mb-1">Data looks wrong?</p>
            <p className="text-xs text-muted-foreground">
              Metrics are based on Harmonic's dataset. If you believe a metric is inaccurate, submit a correction.
            </p>
          </div>
          <div className="flex-shrink-0">
            <CorrectionForm investorName={inv.name} investorSlug={inv.slug} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ProfilePill({ label, title, tint }) {
  if (!label) return null;
  return (
    <span
      title={title || label}
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded-full text-[0.6875rem] font-medium ring-1 whitespace-nowrap',
        tint,
      )}
    >
      {label}
    </span>
  );
}
