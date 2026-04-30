import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-gray-50 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* About */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Investor Rankings</h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              A co-published, data-driven ranking of venture capital investors.
              Built on Harmonic data. Methodology by the University of Chicago.
            </p>
            <p className="text-xs text-gray-400 mt-3">
              Data as of May 2026. Not sponsored or pay-to-play.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Explore</h3>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><Link href="/" className="hover:text-gray-900 transition-colors">All Rankings</Link></li>
              <li><Link href="/methodology" className="hover:text-gray-900 transition-colors">Methodology</Link></li>
              <li>
                <a href="https://harmonic.ai" target="_blank" rel="noopener noreferrer" className="hover:text-gray-900 transition-colors">
                  Harmonic Platform
                </a>
              </li>
            </ul>
          </div>

          {/* Partners */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Partners</h3>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-harmonic-500 rounded flex items-center justify-center text-white text-xs font-bold">H</div>
                <span className="text-sm text-gray-600 font-medium">Harmonic</span>
                <span className="text-xs text-gray-400">Data</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-uchicago-maroon rounded flex items-center justify-center text-white text-xs font-bold">U</div>
                <span className="text-sm text-gray-600 font-medium">UChicago</span>
                <span className="text-xs text-gray-400">Methodology</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-gray-400">
          <p>© 2026 Harmonic. Rankings methodology © University of Chicago Booth School of Business.</p>
          <p>Rankings are for informational purposes only and do not constitute investment advice.</p>
        </div>
      </div>
    </footer>
  );
}
