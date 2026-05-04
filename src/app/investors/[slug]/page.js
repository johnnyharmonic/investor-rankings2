import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getInvestorBySlug, investors, METRICS, getMetricBreakdown, getFilteredInvestors } from '@/data/investors';
import { parseFilterValues } from '@/lib/filters';
import CorrectionForm from '@/components/CorrectionForm';
import InvestorLogo from '@/components/InvestorLogo';
import MethodologyFilters from '@/components/MethodologyFilters';
import PortfolioCompanyCard from '@/components/PortfolioCompanyCard';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowRight01Icon, Alert02Icon } from '@hugeicons/core-free-icons';

export async function generateStaticParams() {
  return investors.map(inv => ({ slug: inv.slug }));
}

export async function generateMetadata({ params }) {
  const inv = getInvestorBySlug(params.slug);
  if (!inv) return {};
  return {
    title: `${inv.name} — Investor rankings`,
    description: `${inv.name} ranks #${inv.rank} overall. See all 9 performance metrics from the Harmonic × UChicago investor rankings.`,
    openGraph: {
      title: `${inv.name} · Rank #${inv.rank} | Harmonic × UChicago investor rankings`,
      description: `Follow-on prob: ${inv.metrics.m1}%. Exit prob: ${inv.metrics.m6}%.`,
    },
  };
}

export default function InvestorPage({ params, searchParams }) {
  const inv = getInvestorBySlug(params.slug);
  if (!inv) notFound();

  const peers = investors
    .filter(i => i.id !== inv.id && i.stage === inv.stage)
    .slice(0, 3);

  const stages = parseFilterValues(searchParams?.stage);
  const sectors = parseFilterValues(searchParams?.sector);
  const geographies = parseFilterValues(searchParams?.geography);

  const filterParams = new URLSearchParams();
  if (stages.length) filterParams.set('stage', stages.join(','));
  if (sectors.length) filterParams.set('sector', sectors.join(','));
  if (geographies.length) filterParams.set('geography', geographies.join(','));
  const filterQs = filterParams.toString();

  // Compute this investor's rank for each metric within the current filter set.
  // Falls back to their position in the unfiltered ranking when they don't match.
  const ranks = Object.fromEntries(
    Object.values(METRICS).map(metric => {
      const filtered = getFilteredInvestors({ stage: stages, sector: sectors, geography: geographies, sortBy: metric.id, sortDir: 'desc' });
      let idx = filtered.findIndex(i => i.id === inv.id);
      if (idx === -1) {
        const all = getFilteredInvestors({ sortBy: metric.id, sortDir: 'desc' });
        idx = all.findIndex(i => i.id === inv.id);
      }
      return [metric.id, idx >= 0 ? idx + 1 : null];
    })
  );

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Hero card */}
      <Card className="mb-6">
        <CardContent className="flex items-start gap-4 min-w-0">
          <InvestorLogo investor={inv} className="w-14 h-14 rounded-lg text-lg" />
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h1 className="font-heading text-2xl font-bold text-foreground tracking-tight">{inv.name}</h1>
              <Badge variant="outline">#{inv.rank} overall</Badge>
            </div>
            {inv.fund !== inv.name && (
              <p className="text-xs text-muted-foreground">{inv.fund}</p>
            )}
            <div className="flex items-center gap-1.5 mt-2 flex-wrap">
              <Badge variant="secondary">{inv.stage}</Badge>
              <Badge variant="secondary">{inv.sector}</Badge>
              <Badge variant="secondary">{inv.geography}</Badge>
              <Badge variant="secondary">Founded {inv.founded}</Badge>
              <Badge variant="secondary">{inv.aum} AUM</Badge>
            </div>
            <p className="text-xs/relaxed text-muted-foreground mt-3 max-w-lg">{inv.description}</p>
          </div>
        </CardContent>
      </Card>

      {/* Metrics grid */}
      <section className="mb-6">
        <h2 className="font-heading text-base font-semibold text-foreground mb-4">Performance metrics</h2>
        <MethodologyFilters />
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {Object.values(METRICS).map(metric => {
            const value = inv.metrics[metric.id];
            const display = metric.unit === '%' ? `${value}%` : `${value} mo`;
            const breakdown = getMetricBreakdown(inv, metric.id);
            const rank = ranks[metric.id];
            return (
              <Card key={metric.id} className="group relative hover:ring-foreground/20 transition-colors">
                <CardContent>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <p className="text-[0.625rem] font-medium text-muted-foreground leading-tight">
                      {metric.fullLabel}
                    </p>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      {metric.caveat && (
                        <HugeiconsIcon
                          icon={Alert02Icon}
                          strokeWidth={2}
                          className="size-3 text-amber-500"
                        />
                      )}
                      {rank !== null && (
                        <span
                          className={cn(
                            'inline-flex items-center px-1.5 py-0.5 rounded-md text-[0.625rem] font-semibold tabular-nums',
                            rank <= 3
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-muted text-muted-foreground'
                          )}
                          title={`Rank #${rank} on ${metric.fullLabel}`}
                        >
                          #{rank}
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="font-heading text-2xl font-bold text-foreground">{display}</p>
                  {breakdown && (
                    <p className="text-[0.625rem] text-muted-foreground mt-1 tabular-nums">
                      {breakdown.text}
                    </p>
                  )}
                </CardContent>
                <div className="pointer-events-none absolute inset-0 z-10">
                  <div className="absolute inset-0 bg-card/0 backdrop-blur-0 transition-[backdrop-filter,background-color] duration-100 group-hover:bg-card/80 group-hover:backdrop-blur-sm" />
                  <div className="absolute inset-0 flex items-center px-4 opacity-0 transition-opacity duration-100 group-hover:opacity-100">
                    <p className="text-xs/relaxed text-foreground">{metric.description}</p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Notable portfolio */}
      {inv.notablePortfolio && inv.notablePortfolio.length > 0 && (
        <section className="mb-6">
          <h2 className="font-heading text-base font-semibold text-foreground mb-3">
            Notable portfolio companies
          </h2>
          <div className="grid grid-cols-3 gap-3">
            {inv.notablePortfolio.slice(0, 9).map(company => (
              <PortfolioCompanyCard key={company} name={company} />
            ))}
          </div>
        </section>
      )}

      {/* Peer comparison */}
      {peers.length > 0 && (
        <section className="mb-6">
          <h2 className="font-heading text-base font-semibold text-foreground mb-4">
            Similar-stage investors
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {peers.map(peer => (
              <Link
                key={peer.id}
                href={filterQs ? `/investors/${peer.slug}?${filterQs}` : `/investors/${peer.slug}`}
                className="group"
              >
                <Card className="hover:ring-foreground/20 transition-colors">
                  <CardContent className="flex items-center gap-3">
                    <InvestorLogo investor={peer} className="w-8 h-8 rounded-md text-[0.625rem]" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground truncate group-hover:underline underline-offset-2">
                        {peer.name}
                      </p>
                      <p className="text-[0.625rem] text-muted-foreground">
                        #{peer.rank} · {peer.stage}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Correction form */}
      <section className="mb-6">
        <h2 className="font-heading text-base font-semibold text-foreground mb-2">Data looks wrong?</h2>
        <p className="text-xs text-muted-foreground mb-4">
          Rankings are based on Harmonic's dataset. If you believe a metric is inaccurate, let us know.
        </p>
        <CorrectionForm investorName={inv.name} investorSlug={inv.slug} />
      </section>

      {/* Methodology note */}
      <Card className="bg-muted/30 mb-12">
        <CardContent className="text-xs/relaxed text-muted-foreground">
          <span className="font-medium text-foreground">Methodology note:</span>{' '}
          Rankings and composite scores are calculated using Harmonic's proprietary dataset and a methodology
          co-developed with the University of Chicago. Data as of May 2026.{' '}
          <Link href="/methodology" className="text-foreground hover:underline inline-flex items-center gap-0.5">
            Read the full methodology
            <HugeiconsIcon icon={ArrowRight01Icon} strokeWidth={2} className="size-3" />
          </Link>
        </CardContent>
      </Card>

      {/* Investor CTA */}
      <Card className="relative bg-foreground text-background border-0 ring-0 shadow-lg overflow-hidden">
        <NetworkBackdrop />
        <CardContent className="relative py-10 sm:py-12 px-6 sm:px-10">
          <div className="max-w-2xl">
            <h2 className="font-heading font-bold text-2xl sm:text-3xl tracking-tight mb-3">
              Are you from {inv.name}?
            </h2>
            <p className="text-sm sm:text-base text-background/70 mb-6">
              Harmonic has deeper data on your portfolio activity, deal flow, and network.
              Explore your full profile or get in touch.
            </p>
            <Button
              asChild
              size="lg"
              className="bg-background text-foreground hover:bg-background/90"
            >
              <a href="https://harmonic.ai" target="_blank" rel="noopener noreferrer">
                Explore Harmonic
                <HugeiconsIcon icon={ArrowRight01Icon} strokeWidth={2} />
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Globe: nodes distributed on a unit sphere via Fibonacci spiral, projected orthographically
const GLOBE_CENTER_X = 780;
const GLOBE_CENTER_Y = 200;
const GLOBE_R = 165;
const GLOBE_NODE_COUNT = 110;

function buildGlobe() {
  const golden = Math.PI * (3 - Math.sqrt(5));
  const nodes = [];
  for (let i = 0; i < GLOBE_NODE_COUNT; i++) {
    const y = 1 - (i / (GLOBE_NODE_COUNT - 1)) * 2;
    const ringR = Math.sqrt(1 - y * y);
    const theta = golden * i;
    const x = Math.cos(theta) * ringR;
    const z = Math.sin(theta) * ringR;
    nodes.push({
      sx: GLOBE_CENTER_X + x * GLOBE_R,
      sy: GLOBE_CENTER_Y + y * GLOBE_R,
      x3: x,
      y3: y,
      z3: z,
    });
  }
  return nodes;
}

function buildGlobeEdges(nodes, k) {
  const edges = new Set();
  for (let i = 0; i < nodes.length; i++) {
    const dists = [];
    for (let j = 0; j < nodes.length; j++) {
      if (i === j) continue;
      const dx = nodes[j].x3 - nodes[i].x3;
      const dy = nodes[j].y3 - nodes[i].y3;
      const dz = nodes[j].z3 - nodes[i].z3;
      dists.push([dx * dx + dy * dy + dz * dz, j]);
    }
    dists.sort((a, b) => a[0] - b[0]);
    for (let m = 0; m < k; m++) {
      const j = dists[m][1];
      const key = i < j ? `${i}_${j}` : `${j}_${i}`;
      edges.add(key);
    }
  }
  return Array.from(edges).map(s => s.split('_').map(Number));
}

const GLOBE_NODES = buildGlobe();
const GLOBE_EDGES = buildGlobeEdges(GLOBE_NODES, 3);

// Ambient star dust scattered behind the globe for universe context
function makeStars(count, seed, rMin, rMax, opacityMin, opacityMax) {
  let s = seed;
  const next = () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
  return Array.from({ length: count }, () => [
    next() * 1000,
    next() * 400,
    rMin + next() * (rMax - rMin),
    opacityMin + next() * (opacityMax - opacityMin),
  ]);
}

const FAR_DUST = makeStars(120, 7, 0.3, 0.9, 0.15, 0.45);
const MID_DUST = makeStars(35, 91, 0.6, 1.4, 0.35, 0.6);

function NetworkBackdrop() {
  return (
    <svg
      aria-hidden="true"
      className="absolute inset-0 w-full h-full pointer-events-none text-background opacity-70 [mask-image:linear-gradient(to_right,transparent_0%,transparent_30%,black_70%,black_100%)] [-webkit-mask-image:linear-gradient(to_right,transparent_0%,transparent_30%,black_70%,black_100%)]"
      viewBox="0 0 1000 400"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <filter id="node-glow" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <radialGradient id="globe-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.18" />
          <stop offset="60%" stopColor="currentColor" stopOpacity="0.06" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Far ambient dust */}
      <g fill="currentColor">
        {FAR_DUST.map(([cx, cy, r, o], i) => (
          <circle key={`f${i}`} cx={cx} cy={cy} r={r} opacity={o} />
        ))}
      </g>
      <g fill="currentColor">
        {MID_DUST.map(([cx, cy, r, o], i) => (
          <circle key={`m${i}`} cx={cx} cy={cy} r={r} opacity={o} />
        ))}
      </g>

      {/* Soft halo behind the globe */}
      <circle
        cx={GLOBE_CENTER_X}
        cy={GLOBE_CENTER_Y}
        r={GLOBE_R * 1.4}
        fill="url(#globe-glow)"
      />

      {/* Globe edges — depth-aware opacity */}
      <g stroke="currentColor" strokeWidth="0.5" fill="none">
        {GLOBE_EDGES.map(([a, b], i) => {
          const na = GLOBE_NODES[a];
          const nb = GLOBE_NODES[b];
          const avgZ = (na.z3 + nb.z3) / 2; // -1 (back) to 1 (front)
          const opacity = 0.08 + ((avgZ + 1) / 2) * 0.45;
          return (
            <line
              key={`e${i}`}
              x1={na.sx}
              y1={na.sy}
              x2={nb.sx}
              y2={nb.sy}
              opacity={opacity}
            />
          );
        })}
      </g>

      {/* Globe nodes — front-facing brighter and larger */}
      <g fill="currentColor" filter="url(#node-glow)">
        {GLOBE_NODES.map((n, i) => {
          const depth = (n.z3 + 1) / 2; // 0 back, 1 front
          const opacity = 0.18 + depth * 0.82;
          const r = 0.9 + depth * 2.4;
          return <circle key={`n${i}`} cx={n.sx} cy={n.sy} r={r} opacity={opacity} />;
        })}
      </g>
    </svg>
  );
}
