'use client';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { STAGES, SECTORS, GEOGRAPHIES } from '@/data/investors';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const DEFAULTS = {
  stage: 'All stages',
  sector: 'All sectors',
  geography: 'All geographies',
};

export default function MethodologyFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const stage = searchParams.get('stage') || DEFAULTS.stage;
  const sector = searchParams.get('sector') || DEFAULTS.sector;
  const geography = searchParams.get('geography') || DEFAULTS.geography;

  const hasFilters =
    stage !== DEFAULTS.stage || sector !== DEFAULTS.sector || geography !== DEFAULTS.geography;

  function update(key, value) {
    const params = new URLSearchParams(searchParams.toString());
    if (value === DEFAULTS[key]) params.delete(key);
    else params.set(key, value);
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }

  function clear() {
    const params = new URLSearchParams(searchParams.toString());
    Object.keys(DEFAULTS).forEach(k => params.delete(k));
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }

  return (
    <div className="mb-6 flex flex-col sm:flex-row gap-2 flex-wrap items-stretch sm:items-center">
      <span className="text-[0.625rem] font-medium text-muted-foreground uppercase tracking-wider self-center sm:mr-1">
        Filter
      </span>
      <FilterSelect value={stage} onChange={v => update('stage', v)} options={STAGES} placeholder="Stage" />
      <FilterSelect value={sector} onChange={v => update('sector', v)} options={SECTORS} placeholder="Industry" />
      <FilterSelect value={geography} onChange={v => update('geography', v)} options={GEOGRAPHIES} placeholder="Location" />
      {hasFilters && (
        <Button variant="ghost" size="sm" onClick={clear} className="sm:ml-auto">
          Clear
        </Button>
      )}
    </div>
  );
}

function FilterSelect({ value, onChange, options, placeholder }) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="min-w-[140px]" aria-label={placeholder}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map(o => (
          <SelectItem key={o} value={o}>{o}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
