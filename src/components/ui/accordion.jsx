'use client';
import { Accordion as RadixAccordion } from 'radix-ui';
import { cn } from '@/lib/utils';

function Accordion({ ...props }) {
  return <RadixAccordion.Root {...props} />;
}

function AccordionItem({ className, ...props }) {
  return (
    <RadixAccordion.Item
      className={cn('border-b border-border', className)}
      {...props}
    />
  );
}

function AccordionTrigger({ className, children, ...props }) {
  return (
    <RadixAccordion.Header className="flex">
      <RadixAccordion.Trigger
        className={cn(
          'flex flex-1 items-center justify-between py-4 text-sm font-medium transition-all hover:underline text-left [&[data-state=open]>svg]:rotate-180',
          className
        )}
        {...props}
      >
        {children}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200"
          aria-hidden="true"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </RadixAccordion.Trigger>
    </RadixAccordion.Header>
  );
}

function AccordionContent({ className, children, ...props }) {
  return (
    <RadixAccordion.Content
      className="overflow-hidden text-sm data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
      {...props}
    >
      <div className={cn('pb-4 pt-0', className)}>{children}</div>
    </RadixAccordion.Content>
  );
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
