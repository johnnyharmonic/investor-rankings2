'use client';
import { Label as RadixLabel } from 'radix-ui';
import { cn } from '@/lib/utils';

function Label({ className, ...props }) {
  return (
    <RadixLabel.Root
      className={cn(
        'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
        className
      )}
      {...props}
    />
  );
}

export { Label };
