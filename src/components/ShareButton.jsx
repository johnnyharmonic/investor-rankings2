'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { HugeiconsIcon } from '@hugeicons/react';
import { Share08Icon, Tick02Icon } from '@hugeicons/core-free-icons';

export default function ShareButton() {
  const [copied, setCopied] = useState(false);

  async function copy() {
    if (typeof window === 'undefined') return;
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // older browsers / insecure origins
      const ta = document.createElement('textarea');
      ta.value = window.location.href;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <Button variant="outline" size="lg" onClick={copy} aria-label="Copy share link">
      <HugeiconsIcon icon={copied ? Tick02Icon : Share08Icon} strokeWidth={2} />
      {copied ? 'Link copied' : 'Share'}
    </Button>
  );
}
