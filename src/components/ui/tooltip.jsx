'use client';
import { Tooltip as RadixTooltip } from 'radix-ui';
import { cn } from '@/lib/utils';

function TooltipProvider({ delayDuration = 400, ...props }) {
  return <RadixTooltip.Provider delayDuration={delayDuration} {...props} />;
}

function Tooltip({ ...props }) {
  return <RadixTooltip.Root {...props} />;
}

function TooltipTrigger({ ...props }) {
  return <RadixTooltip.Trigger {...props} />;
}

function TooltipContent({ className, sideOffset = 4, ...props }) {
  return (
    <RadixTooltip.Portal>
      <RadixTooltip.Content
        sideOffset={sideOffset}
        className={cn(
          'z-50 overflow-hidden rounded-md bg-popover px-3 py-1.5 text-xs text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 max-w-xs',
          className
        )}
        {...props}
      />
    </RadixTooltip.Portal>
  );
}

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };
