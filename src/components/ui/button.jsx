import * as React from 'react';
import { cva } from 'class-variance-authority';
import { Slot } from 'radix-ui';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'group/button inline-flex shrink-0 items-center justify-center rounded-md border border-transparent bg-clip-padding text-xs font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 active:translate-y-px disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default:     'bg-primary text-primary-foreground hover:bg-primary/80',
        outline:     'border-border hover:bg-input/50 hover:text-foreground',
        secondary:   'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost:       'hover:bg-muted hover:text-foreground',
        destructive: 'bg-destructive/10 text-destructive hover:bg-destructive/20',
        link:        'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm:      'h-8 rounded-md px-3 text-xs',
        lg:      'h-10 rounded-md px-8',
        icon:    'h-9 w-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

function Button({ className, variant = 'default', size = 'default', asChild = false, ...props }) {
  const Comp = asChild ? Slot.Root : 'button';
  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
