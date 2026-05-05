import { ImageResponse } from 'next/og';
import { METRICS, getFilteredInvestors } from '@/data/investors';

export const runtime = 'edge';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const alt = 'Investor rankings — Harmonic × UChicago';

const RANK_COLORS = ['#10b981', '#34d399', '#6ee7b7'];

export default async function Image({ params }) {
  const metric = METRICS[params.methodology];
  if (!metric) return new ImageResponse(<div style={{ display: 'flex' }} />, size);

  const top3 = getFilteredInvestors({ sortBy: metric.id, sortDir: 'desc' }).slice(0, 3);
  const formatValue = v => (metric.unit === '%' ? `${v}%` : `${v} mo`);

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          padding: '56px 64px',
          background: '#0a0a0a',
          color: '#fafafa',
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        {/* Eyebrow */}
        <div
          style={{
            display: 'flex',
            fontSize: 22,
            color: 'rgba(250,250,250,0.55)',
          }}
        >
          Ranked by
        </div>

        {/* Title */}
        <div
          style={{
            display: 'flex',
            fontSize: 56,
            fontWeight: 800,
            lineHeight: 1.05,
            letterSpacing: -1.5,
            marginTop: 4,
          }}
        >
          {metric.fullLabel}
        </div>

        {/* Top 3 */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
            marginTop: 36,
          }}
        >
          {top3.map((inv, idx) => (
            <div
              key={inv.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 18,
                padding: '14px 20px',
                background: 'rgba(250,250,250,0.06)',
                border: '1px solid rgba(250,250,250,0.1)',
                borderRadius: 14,
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 9999,
                  background: RANK_COLORS[idx],
                  color: '#0a0a0a',
                  fontWeight: 800,
                  fontSize: 20,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                {idx + 1}
              </div>
              {inv.domain && (
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 10,
                    background: '#fafafa',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                    flexShrink: 0,
                  }}
                >
                  <img
                    src={`https://www.google.com/s2/favicons?domain=${inv.domain}&sz=128`}
                    alt=""
                    width={28}
                    height={28}
                    style={{ objectFit: 'contain' }}
                  />
                </div>
              )}
              <div style={{ display: 'flex', fontSize: 28, fontWeight: 600, flex: 1 }}>
                {inv.name}
              </div>
              <div
                style={{
                  display: 'flex',
                  fontSize: 30,
                  fontWeight: 700,
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                {formatValue(inv.metrics[metric.id])}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: 'auto',
            fontSize: 16,
            color: 'rgba(250,250,250,0.55)',
          }}
        >
          <div style={{ display: 'flex' }}>Investor rankings · Harmonic × UChicago</div>
          <div style={{ display: 'flex' }}>investors.harmonic.ai</div>
        </div>
      </div>
    ),
    size
  );
}
