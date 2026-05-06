'use client';
import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import ThemeToggle from '@/components/ThemeToggle';
import { HugeiconsIcon } from '@hugeicons/react';
import { Menu01Icon, Cancel01Icon } from '@hugeicons/core-free-icons';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="border-b border-border/60 bg-background/70 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        <div className="flex items-center justify-between h-14">
          <Link
            href="/"
            className="font-heading font-medium text-base tracking-tight text-foreground"
          >
            Investor rankings
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            <Button asChild variant="ghost" size="sm">
              <Link href="/methodology">About</Link>
            </Button>
            <Button asChild variant="ghost" size="sm">
              <a href="https://harmonic.ai" target="_blank" rel="noopener noreferrer">
                Explore Harmonic
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

        {menuOpen && (
          <div className="md:hidden border-t border-border py-2 flex flex-col gap-1">
            <Button asChild variant="ghost" size="sm" className="justify-start">
              <Link href="/methodology" onClick={() => setMenuOpen(false)}>About</Link>
            </Button>
            <Button asChild variant="ghost" size="sm" className="justify-start">
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
