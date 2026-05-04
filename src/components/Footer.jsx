import Link from 'next/link';
import { Separator } from '@/components/ui/separator';

export default function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <h3 className="font-semibold text-sm text-foreground mb-3">Investor rankings</h3>
            <p className="text-xs/relaxed text-muted-foreground">
              A co-published, data-driven ranking of venture capital investors.
              Built on Harmonic data. Methodology by the University of Chicago.
            </p>
            <p className="text-[0.625rem] text-muted-foreground/70 mt-3">
              Data as of May 2026. Not sponsored or pay-to-play.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-sm text-foreground mb-3">Explore</h3>
            <ul className="space-y-2 text-xs/relaxed text-muted-foreground">
              <li><Link href="/methodology" className="hover:text-foreground transition-colors">About</Link></li>
              <li>
                <a href="https://harmonic.ai" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
                  Harmonic platform
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-sm text-foreground mb-3">Partners</h3>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded bg-card ring-1 ring-border flex items-center justify-center overflow-hidden">
                  <img
                    src="https://icons.duckduckgo.com/ip3/harmonic.ai.ico"
                    alt="Harmonic logo"
                    className="w-4 h-4 object-contain"
                  />
                </span>
                <span className="text-xs text-foreground font-medium">Harmonic</span>
                <span className="text-[0.625rem] text-muted-foreground">Data</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded bg-card ring-1 ring-border flex items-center justify-center overflow-hidden">
                  <img
                    src="https://icons.duckduckgo.com/ip3/uchicago.edu.ico"
                    alt="University of Chicago logo"
                    className="w-4 h-4 object-contain"
                  />
                </span>
                <span className="text-xs text-foreground font-medium">UChicago</span>
                <span className="text-[0.625rem] text-muted-foreground">Methodology</span>
              </div>
            </div>
          </div>
        </div>

        <Separator className="mt-10 mb-6" />
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 text-[0.625rem] text-muted-foreground">
          <p>© 2026 Harmonic. Rankings methodology © University of Chicago Booth School of Business.</p>
          <p>Rankings are for informational purposes only and do not constitute investment advice.</p>
        </div>
      </div>
    </footer>
  );
}
