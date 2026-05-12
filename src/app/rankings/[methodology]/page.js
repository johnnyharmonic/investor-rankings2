import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { METRICS } from '@/data/investors';
import MethodologyRankingsList from '@/components/MethodologyRankingsList';
import MethodologyTabs from '@/components/MethodologyTabs';
import { FilterControls, FiltersMobileTrigger, SearchInput } from '@/components/MethodologyFilters';
import ShareButton from '@/components/ShareButton';
import BrandChip from '@/components/BrandChip';
import TableBorderRunner from '@/components/TableBorderRunner';

export async function generateStaticParams() {
  return Object.keys(METRICS).map(id => ({ methodology: id }));
}

export async function generateMetadata({ params }) {
  const metric = METRICS[params.methodology];
  if (!metric) return {};
  return {
    title: `Ranked by ${metric.fullLabel} — Investor rankings`,
    description: `Investors ranked by ${metric.fullLabel}. ${metric.description}`,
    twitter: {
      card: 'summary_large_image',
      title: `Ranked by ${metric.fullLabel}`,
      description: metric.description,
    },
  };
}

export default function MethodologyRankingsPage({ params }) {
  const metric = METRICS[params.methodology];
  if (!metric) notFound();

  return (
    <div className="relative isolate max-w-[1712px] mx-auto px-2 lg:pb-10">
      <div className="sticky top-14 z-0 mb-8">
        <img
          aria-hidden="true"
          src="/hero-rings.svg"
          alt=""
          className="pointer-events-none select-none absolute left-1/2 top-[260px] lg:top-[440px] -translate-x-1/2 -translate-y-1/2 w-full max-w-none h-auto -z-10 opacity-[0.08] dark:opacity-60 [mask-image:linear-gradient(to_bottom,black_0%,black_30%,transparent_70%)]"
        />

      <header className="max-w-7xl px-6 pt-[40px] flex flex-col justify-between min-h-[340px]">
        <h1 className="font-heading text-3xl sm:text-4xl font-medium tracking-tight leading-tight">
          <span className="block text-foreground">Explore top investors, based on data.</span>
          <span className="block text-muted-foreground/40">200K+ investors, ranked.</span>
        </h1>

        <div className="flex flex-col items-start gap-2 mt-8">
          <span className="text-[0.625rem] uppercase tracking-wider text-muted-foreground">Presented by</span>
          <div className="inline-flex items-center gap-1.5 rounded-[14px] border border-border dark:border-white/[0.07] bg-card/60 pl-3.5 pr-2.5 py-2">
            <BrandChip domain="harmonic.ai" name="Harmonic" alt="Harmonic" bare />
            <span className="text-foreground/60 text-xs">×</span>
            <BrandChip domain="uchicago.edu" name="University of Chicago" alt="UChicago" bare />
          </div>
        </div>
      </header>
      </div>

      <div className="relative lg:grid lg:grid-cols-[230px_minmax(0,1fr)] bg-zinc-100 dark:bg-[#141414] rounded-[40px] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05),0_0_0_1px_rgba(0,0,0,0.04),0_3px_3px_-1px_rgba(0,0,0,0.04)]">
        <TableBorderRunner />
        <aside className="hidden lg:block lg:border-r lg:border-border dark:lg:border-white/[0.06]">
          <div className="sticky top-20 flex flex-col gap-6 p-6">
            <Suspense fallback={<div className="h-72" />}>
              <FilterControls layout="stacked" />
            </Suspense>
            <div className="pt-5 border-t border-border dark:border-white/[0.06]">
              <ShareButton />
            </div>
          </div>
        </aside>

        <main className="min-w-0">
          <div className="lg:hidden mb-4 flex items-center gap-2 p-3">
            <Suspense fallback={<div className="h-9 flex-1" />}>
              <div className="flex-1">
                <SearchInput />
              </div>
            </Suspense>
            <Suspense fallback={<div className="size-9" />}>
              <FiltersMobileTrigger />
            </Suspense>
          </div>

          <div className="overflow-hidden rounded-[40px] lg:rounded-l-none">
            <Suspense fallback={<div className="h-24" />}>
              <MethodologyTabs activeMetricId={metric.id} />
            </Suspense>

            <Suspense fallback={<div className="h-96" />}>
              <MethodologyRankingsList metric={metric} />
            </Suspense>
          </div>
        </main>
      </div>
    </div>
  );
}
