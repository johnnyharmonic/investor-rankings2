'use client';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { STAGES, SECTORS, GEOGRAPHIES } from '@/data/investors';
import { Button } from '@/components/ui/button';
import MultiSelect from '@/components/MultiSelect';
import { parseFilterValues } from '@/lib/filters';

export default function MethodologyFilters({ endSlot }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const stages = parseFilterValues(searchParams.get('stage'));
  const sectors = parseFilterValues(searchParams.get('sector'));
  const geographies = parseFilterValues(searchParams.get('geography'));

  const hasFilters = stages.length > 0 || sectors.length > 0 || geographies.length > 0;

  function update(key, values) {
    const params = new URLSearchParams(searchParams.toString());
    if (values.length === 0) params.delete(key);
    else params.set(key, values.join(','));
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }

  function clear() {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('stage');
    params.delete('sector');
    params.delete('geography');
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }

  return (
    <div className="mb-6 flex flex-col sm:flex-row gap-2 flex-wrap items-stretch sm:items-center">
      <span className="text-[0.625rem] font-medium text-muted-foreground uppercase tracking-wider self-center sm:mr-1">
        Filter
      </span>
      <MultiSelect
        values={stages}
        onChange={v => update('stage', v)}
        options={STAGES}
        placeholder="Stage focus"
      />
      <MultiSelect
        values={sectors}
        onChange={v => update('sector', v)}
        options={SECTORS}
        placeholder="Sector focus"
      />
      <MultiSelect
        values={geographies}
        onChange={v => update('geography', v)}
        options={GEOGRAPHIES}
        placeholder="Country focus"
      />
      {hasFilters && (
        <Button variant="ghost" size="sm" onClick={clear}>
          Clear
        </Button>
      )}
      {endSlot && <div className="sm:ml-auto">{endSlot}</div>}
    </div>
  );
}
