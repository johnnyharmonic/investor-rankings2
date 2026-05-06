'use client';
import { useState } from 'react';
import { Popover as PopoverPrimitive } from 'radix-ui';
import { cn } from '@/lib/utils';
import { HugeiconsIcon } from '@hugeicons/react';
import { UnfoldMoreIcon, Tick02Icon } from '@hugeicons/core-free-icons';

export default function MultiSelect({ values, onChange, options, placeholder }) {
  const [open, setOpen] = useState(false);

  const allLabel = options[0];
  const realOptions = options.slice(1);
  const selected = new Set(values);

  const summary =
    values.length === 0
      ? allLabel
      : values.length === 1
        ? values[0]
        : `${values[0]} +${values.length - 1}`;

  function toggle(opt) {
    if (selected.has(opt)) onChange(values.filter(v => v !== opt));
    else onChange([...values, opt]);
  }

  return (
    <PopoverPrimitive.Root open={open} onOpenChange={setOpen}>
      <PopoverPrimitive.Trigger asChild>
        <button
          type="button"
          aria-label={placeholder}
          className={cn(
            'flex h-9 min-w-[140px] items-center justify-between gap-2 rounded-lg border border-input bg-card px-3 py-2 text-sm transition-colors hover:bg-accent/50',
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-ring'
          )}
        >
          <span className={values.length === 0 ? 'text-muted-foreground' : 'text-foreground'}>
            {summary}
          </span>
          <HugeiconsIcon icon={UnfoldMoreIcon} strokeWidth={2} className="size-3 text-muted-foreground" />
        </button>
      </PopoverPrimitive.Trigger>
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          align="start"
          sideOffset={6}
          className="z-50 min-w-[180px] rounded-md border bg-popover text-popover-foreground shadow-md p-1 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
        >
          <button
            type="button"
            onClick={() => onChange([])}
            className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-xs text-muted-foreground hover:bg-accent transition-colors"
          >
            <span className="w-4 h-4 flex items-center justify-center">
              {values.length === 0 && (
                <HugeiconsIcon icon={Tick02Icon} strokeWidth={2.5} className="size-3" />
              )}
            </span>
            {allLabel}
          </button>
          {realOptions.map(opt => {
            const isSelected = selected.has(opt);
            return (
              <button
                key={opt}
                type="button"
                onClick={() => toggle(opt)}
                className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent transition-colors"
              >
                <span
                  className={cn(
                    'w-4 h-4 rounded-sm border flex items-center justify-center transition-colors',
                    isSelected ? 'bg-foreground border-foreground text-background' : 'bg-card border-input'
                  )}
                >
                  {isSelected && (
                    <HugeiconsIcon icon={Tick02Icon} strokeWidth={3} className="size-3" />
                  )}
                </span>
                {opt}
              </button>
            );
          })}
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
}
