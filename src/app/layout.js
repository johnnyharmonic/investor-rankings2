import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata = {
  title: {
    default: 'Investor Rankings — Harmonic × UChicago',
    template: '%s | Investor Rankings',
  },
  description: 'Objective, data-driven VC rankings built for founders. Co-published by Harmonic and the University of Chicago.',
  openGraph: {
    title: 'Investor Rankings — Harmonic × UChicago',
    description: 'Objective, data-driven VC rankings built for founders.',
    type: 'website',
    url: 'https://investors.harmonic.ai',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Investor Rankings — Harmonic × UChicago',
    description: 'Objective, data-driven VC rankings built for founders.',
    images: ['/og-image.png'],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900 min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
