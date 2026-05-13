'use client';
import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import ThemeToggle from '@/components/ThemeToggle';
import InvestorSearch from '@/components/InvestorSearch';
import { HugeiconsIcon } from '@hugeicons/react';
import { Menu01Icon, Cancel01Icon } from '@hugeicons/core-free-icons';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="border-b border-border/60 bg-background/70 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-[1712px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4 h-14">
          <div className="flex-1 flex items-center min-w-0">
            <Link
              href="/"
              className="font-heading font-medium text-base tracking-tight text-foreground flex-shrink-0"
            >
              Investor rankings
            </Link>
          </div>

          <div className="hidden md:flex flex-1 justify-center">
            <div className="w-full max-w-[500px]">
              <InvestorSearch />
            </div>
          </div>

          <div className="flex-1 flex items-center justify-end gap-1 min-w-0">
            <nav className="hidden md:flex items-center gap-1 flex-shrink-0">
              <Button asChild variant="ghost" size="sm">
                <Link href="/rankings/m1">Explore investors</Link>
              </Button>
              <Button asChild variant="ghost" size="sm">
                <Link href="/methodology">About</Link>
              </Button>
              <Button asChild variant="ghost" size="sm">
                <a href="https://harmonic.ai" target="_blank" rel="noopener noreferrer">
                  View Harmonic
                </a>
              </Button>
              <span className="ml-1">
                <ThemeToggle />
              </span>
            </nav>

            <div className="flex items-center gap-1 md:hidden">
              <ThemeToggle />
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label="Toggle menu"
              >
                <HugeiconsIcon icon={menuOpen ? Cancel01Icon : Menu01Icon} strokeWidth={2} />
              </Button>
            </div>
          </div>
        </div>

        {menuOpen && (
          <div className="md:hidden border-t border-border py-2 flex flex-col gap-2">
            <div className="px-1 pt-1">
              <InvestorSearch />
            </div>
            <Button asChild variant="ghost" size="sm" className="justify-start">
              <Link href="/rankings/m1" onClick={() => setMenuOpen(false)}>Explore investors</Link>
            </Button>
            <Button asChild variant="ghost" size="sm" className="justify-start">
              <Link href="/methodology" onClick={() => setMenuOpen(false)}>About</Link>
            </Button>
            <Button asChild variant="ghost" size="sm" className="justify-start">
              <a href="https://harmonic.ai" target="_blank" rel="noopener noreferrer">
                View Harmonic
              </a>
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}
