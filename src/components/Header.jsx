'use client';
import Link from 'next/link';
import { useState } from 'react';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="border-b border-gray-200 bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo / wordmark */}
          <Link href="/" className="flex items-center gap-3">
            <span className="font-bold text-lg text-gray-900 tracking-tight">
              Investor Rankings
            </span>
            <span className="hidden sm:inline-flex items-center gap-1 text-xs text-gray-500 border border-gray-200 rounded-full px-2 py-0.5">
              <span className="w-2 h-2 rounded-full bg-uchicago-maroon inline-block" />
              × UChicago
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <Link href="/" className="text-gray-600 hover:text-gray-900 transition-colors">Rankings</Link>
            <Link href="/methodology" className="text-gray-600 hover:text-gray-900 transition-colors">Methodology</Link>
            <a
              href="https://harmonic.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-harmonic-500 text-white px-4 py-1.5 rounded-full text-sm font-medium hover:bg-harmonic-600 transition-colors"
            >
              Explore Harmonic
            </a>
          </nav>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 text-gray-600"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              }
            </svg>
          </button>
        </div>

        {/* Mobile nav */}
        {menuOpen && (
          <div className="md:hidden border-t border-gray-100 py-3 flex flex-col gap-3 text-sm">
            <Link href="/" className="text-gray-600 hover:text-gray-900 py-1" onClick={() => setMenuOpen(false)}>Rankings</Link>
            <Link href="/methodology" className="text-gray-600 hover:text-gray-900 py-1" onClick={() => setMenuOpen(false)}>Methodology</Link>
            <a
              href="https://harmonic.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-harmonic-500 text-white px-4 py-2 rounded-full font-medium text-center"
            >
              Explore Harmonic
            </a>
          </div>
        )}
      </div>
    </header>
  );
}
