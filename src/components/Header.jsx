'use client';
import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { HugeiconsIcon } from '@hugeicons/react';
import { Menu01Icon, Cancel01Icon } from '@hugeicons/core-free-icons';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          <Link href="/" className="font-semibold text-sm tracking-tight text-foreground">
            Investor rankings
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            <Button asChild variant="ghost" size="lg">
              <Link href="/methodology">About</Link>
            </Button>
            <Button asChild size="lg" className="ml-2">
              <a href="https://harmonic.ai" target="_blank" rel="noopener noreferrer">
                Explore Harmonic
              </a>
            </Button>
          </nav>

          <Button
            variant="ghost"
            size="icon-sm"
            className="md:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <HugeiconsIcon icon={menuOpen ? Cancel01Icon : Menu01Icon} strokeWidth={2} />
          </Button>
        </div>

        {menuOpen && (
          <div className="md:hidden border-t border-border py-2 flex flex-col gap-1">
            <Button asChild variant="ghost" size="lg" className="justify-start">
              <Link href="/methodology" onClick={() => setMenuOpen(false)}>About</Link>
            </Button>
            <Button asChild size="lg" className="justify-start">
              <a href="https://harmonic.ai" target="_blank" rel="noopener noreferrer">
                Explore Harmonic
              </a>
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}
