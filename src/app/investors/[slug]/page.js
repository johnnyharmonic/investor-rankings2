import { notFound } from 'next/navigation';
import { getInvestorBySlug, investors, METRICS, getMetricBreakdown } from '@/data/investors';
import { getInsights, scopeLabel, scopePillLabel, ordinalParts } from '@/lib/insights';
import { typeShort, typeTint, stageTint, sectorTint } from '@/lib/sectorColors';
import { PODIUM_GRADIENT, PODIUM_NUM_COLOR, PODIUM_NUM_STYLE } from '@/lib/rankStyles';

const COUNTRY_TINT = 'bg-violet-500/10 text-violet-700 dark:text-violet-300 ring-violet-500/20';
const NEUTRAL_TINT = 'bg-foreground text-background ring-foreground/20';

function scopeTint(combo) {
  if (combo.type) return typeTint(combo.type);
  if (combo.stage) return stageTint(combo.stage);
  if (combo.sector) return sectorTint(combo.sector);
  if (combo.geography) return COUNTRY_TINT;
  return NEUTRAL_TINT;
}
import CorrectionForm from '@/components/CorrectionForm';
import InvestorLogo from '@/components/InvestorLogo';
import LogoGlow from '@/components/LogoGlow';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
function LinkedInIcon({ className }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
      <path d="M3.10899 4.55606C3.90552 4.55606 4.55123 3.90924 4.55123 3.11136C4.55123 2.31347 3.90552 1.66666 3.10899 1.66666C2.31246 1.66666 1.66675 2.31347 1.66675 3.11136C1.66675 3.90924 2.31246 4.55606 3.10899 4.55606Z" fill="currentColor" />
      <path d="M5.91305 5.65081V13.666H8.39743V9.70231C8.39743 8.65642 8.59386 7.64355 9.88845 7.64355C11.1652 7.64355 11.1811 8.83932 11.1811 9.76834V13.6667H13.6667V9.27115C13.6667 7.11202 13.2027 5.45272 10.6834 5.45272C9.47383 5.45272 8.66307 6.11763 8.33151 6.74688H8.29789V5.65081H5.91305ZM1.8645 5.65081H4.35282V13.666H1.8645V5.65081Z" fill="currentColor" />
    </svg>
  );
}

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
      <header className="flex items-start justify-between gap-4 flex-wrap mb-5">
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
              <LinkedInIcon />
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
        <p className="text-sm text-muted-foreground mb-5 max-w-3xl">{inv.description}</p>
      )}

      <div className="flex items-center gap-2 flex-wrap mb-20">
        <ProfilePill label={typeShort(inv.primaryType)} title={inv.primaryType} tint={typeTint(inv.primaryType)} />
        <ProfilePill label={inv.stage} tint={stageTint(inv.stage)} />
        <ProfilePill label={inv.sector} tint={sectorTint(inv.sector)} />
        <ProfilePill label={inv.geography} tint="bg-violet-500/10 text-violet-700 dark:text-violet-300 ring-violet-500/20" />
      </div>

      {/* Highlights */}
      {insights.length > 0 && (
        <section className="mb-20">
          <h2 className="font-heading text-xl font-medium text-foreground mb-4">Highlights</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {insights.map((ins, i) => {
              const metric = METRICS[ins.metricId];
              const isPodium = ins.rank >= 1 && ins.rank <= 3;
              const podiumIdx = ins.rank - 1;
              return (
                <Card
                  key={i}
                  className="bg-surface-raised rounded-[28px] min-h-[180px]"
                  style={isPodium ? { backgroundImage: PODIUM_GRADIENT[podiumIdx] } : undefined}
                >
                  <CardContent className="flex flex-col h-full justify-between gap-6">
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-sm text-muted-foreground whitespace-nowrap">{metric.fullLabel}</p>
                      <span
                        title={scopePillLabel(ins.combo)}
                        className={cn(
                          'inline-block max-w-[55%] px-2 py-0.5 rounded-full text-[0.6875rem] font-medium ring-1 truncate',
                          scopeTint(ins.combo),
                        )}
                      >
                        {scopePillLabel(ins.combo)}
                      </span>
                    </div>
                    <div>
                      <p
                        className={cn(
                          'font-mono text-3xl font-medium tracking-tight leading-none mb-1.5 tabular-nums',
                          !isPodium && 'text-foreground',
                        )}
                        style={isPodium ? PODIUM_NUM_STYLE[podiumIdx] : undefined}
                      >
                        {ordinalParts(ins.rank).number}
                        <span className="text-base align-top">{ordinalParts(ins.rank).suffix}</span>
                      </p>
                      <p className="text-xs text-muted-foreground">{scopeLabel(ins.combo)}</p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>
      )}

      {/* Performance metrics */}
      <section className="mb-20">
        <h2 className="font-heading text-xl font-medium text-foreground mb-4">Performance metrics</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {Object.values(METRICS).map(metric => {
            const value = inv.metrics[metric.id];
            const unit = metric.unit === '%' ? '%' : ' mo';
            const breakdown = getMetricBreakdown(inv, metric.id);
            return (
              <Card key={metric.id} className="bg-surface-raised rounded-[28px] min-h-[180px]">
                <CardContent className="flex flex-col h-full justify-between gap-4">
                  <p className="text-sm text-muted-foreground">{metric.fullLabel}</p>
                  <div>
                    <p className="font-mono text-3xl font-medium text-foreground tabular-nums leading-none mb-1.5">
                      {value}
                      <span className="text-base font-medium text-foreground">{unit}</span>
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
