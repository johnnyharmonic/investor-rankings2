'use client';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { STAGES, SECTORS, GEOGRAPHIES } from '@/data/investors';
import { TYPES } from '@/lib/investorTypes';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import MultiSelect from '@/components/MultiSelect';
import { parseFilterValues } from '@/lib/filters';
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetBody,
  SheetFooter,
  SheetClose,
} from '@/components/ui/sheet';
import { HugeiconsIcon } from '@hugeicons/react';
import { FilterIcon, Search01Icon } from '@hugeicons/core-free-icons';
import { cn } from '@/lib/utils';

const FILTER_KEYS = ['type', 'stage', 'sector', 'geography'];

function useFilterState() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const values = {
    type: parseFilterValues(searchParams.get('type')),
    stage: parseFilterValues(searchParams.get('stage')),
    sector: parseFilterValues(searchParams.get('sector')),
    geography: parseFilterValues(searchParams.get('geography')),
  };
  const query = searchParams.get('q') ?? '';
  const total = FILTER_KEYS.reduce((n, k) => n + values[k].length, 0) + (query ? 1 : 0);

  function update(key, next) {
    const params = new URLSearchParams(searchParams.toString());
    if (next.length === 0) params.delete(key);
    else params.set(key, next.join(','));
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }

  function updateQuery(next) {
    const params = new URLSearchParams(searchParams.toString());
    if (!next) params.delete('q');
    else params.set('q', next);
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }

  function clear() {
    const params = new URLSearchParams(searchParams.toString());
    for (const key of FILTER_KEYS) params.delete(key);
    params.delete('q');
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }

  return { values, query, total, update, updateQuery, clear };
}

// Debounced search input — keeps typing snappy without thrashing the URL.
function SearchInput() {
  const { query, updateQuery } = useFilterState();
  const [local, setLocal] = useState(query);

  useEffect(() => {
    setLocal(query);
  }, [query]);

  useEffect(() => {
    if (local === query) return;
    const handle = setTimeout(() => updateQuery(local), 200);
    return () => clearTimeout(handle);
  }, [local, query, updateQuery]);

  return (
    <div className="relative">
      <HugeiconsIcon
        icon={Search01Icon}
        strokeWidth={2}
        className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground pointer-events-none"
      />
      <Input
        type="text"
        value={local}
        onChange={e => setLocal(e.target.value)}
        placeholder="Search for an investor"
        className="h-9 pl-8 pr-2 rounded-full bg-card/50"
        aria-label="Search for an investor"
      />
    </div>
  );
}

const FIELDS = [
  { key: 'type', options: TYPES, placeholder: 'Investor type', label: 'Type' },
  { key: 'stage', options: STAGES, placeholder: 'Stage focus', label: 'Stage focus' },
  { key: 'sector', options: SECTORS, placeholder: 'Sector focus', label: 'Sector focus' },
  { key: 'geography', options: GEOGRAPHIES, placeholder: 'Country focus', label: 'Country focus' },
];

// Shared body — used by the desktop sidebar and the mobile sheet.
// `layout="stacked"` shows labels above each control (sidebar / sheet);
// `layout="inline"` lays them out as a horizontal strip (legacy / desktop top-bar).
export function FilterControls({ layout = 'inline', showClear = true, className }) {
  const { values, total, update, clear } = useFilterState();

  if (layout === 'stacked') {
    return (
      <div className={cn('flex flex-col gap-5', className)}>
        <SearchInput />
        <div className="flex flex-col gap-4 pt-5 border-t border-border dark:border-white/[0.06]">
          <p className="text-xs font-medium text-foreground">Investor filters</p>
          {FIELDS.map(f => (
            <div key={f.key} className="flex flex-col gap-1.5">
              <label className="text-[0.6875rem] font-medium text-muted-foreground">
                {f.label}
              </label>
              <MultiSelect
                values={values[f.key]}
                onChange={v => update(f.key, v)}
                options={f.options}
                placeholder={f.placeholder}
              />
            </div>
          ))}
        </div>
        {showClear && total > 0 && (
          <Button variant="ghost" size="sm" onClick={clear} className="self-start text-muted-foreground">
            Clear all
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className={cn('flex flex-col sm:flex-row gap-2 flex-wrap items-stretch sm:items-center', className)}>
      {FIELDS.map(f => (
        <MultiSelect
          key={f.key}
          values={values[f.key]}
          onChange={v => update(f.key, v)}
          options={f.options}
          placeholder={f.placeholder}
        />
      ))}
      {showClear && total > 0 && (
        <Button variant="ghost" size="sm" onClick={clear}>
          Clear
        </Button>
      )}
    </div>
  );
}

// Mobile entry point — a single "Filters (N)" button that pops a bottom sheet.
export function FiltersMobileTrigger({ className }) {
  const [open, setOpen] = useState(false);
  const { total, clear } = useFilterState();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className={cn('gap-2', className)}>
          <HugeiconsIcon icon={FilterIcon} strokeWidth={2} className="size-3.5" />
          <span>Filters</span>
          {total > 0 && (
            <span className="inline-flex items-center justify-center rounded-full bg-foreground text-background text-[0.625rem] font-semibold tabular-nums min-w-[1.125rem] h-[1.125rem] px-1.5">
              {total}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="max-h-[85vh]">
        <SheetHeader>
          <SheetTitle>Filters</SheetTitle>
        </SheetHeader>
        <SheetBody>
          <FilterControls layout="stacked" showClear={false} />
        </SheetBody>
        <SheetFooter>
          <Button variant="ghost" size="sm" onClick={clear} disabled={total === 0}>
            Clear all
          </Button>
          <SheetClose asChild>
            <Button size="sm">Done</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

// Backward-compatible default export — the legacy inline filter strip with an
// optional end slot (used today for the ShareButton).
export default function MethodologyFilters({ endSlot, className }) {
  return (
    <div className={cn('flex flex-col sm:flex-row gap-2 flex-wrap items-stretch sm:items-center', className)}>
      <FilterControls layout="inline" />
      {endSlot && <div className="sm:ml-auto">{endSlot}</div>}
    </div>
  );
}
