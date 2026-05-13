// Shared rank-1/2/3 visual treatments (gold / silver / copper)

// Top-left origin (default — used in row-style lists)
export const RANK_GRADIENT = [
  'radial-gradient(circle at 0% 0%, rgba(250, 204, 21, 0.035), transparent 35%)',
  'radial-gradient(circle at 0% 0%, rgba(226, 232, 240, 0.025), transparent 35%)',
  'radial-gradient(circle at 0% 0%, rgba(217, 119, 6, 0.035), transparent 35%)',
];

// Top-right origin (used in card-style tiles where the rank pill sits in the top-right)
export const RANK_GRADIENT_TR = [
  'radial-gradient(circle at 100% 0%, rgba(250, 204, 21, 0.035), transparent 35%)',
  'radial-gradient(circle at 100% 0%, rgba(226, 232, 240, 0.025), transparent 35%)',
  'radial-gradient(circle at 100% 0%, rgba(217, 119, 6, 0.035), transparent 35%)',
];

export const RANK_NUM_COLOR = ['text-amber-400', 'text-slate-300', 'text-[#c89882]'];

// Pill backgrounds (very subtle tints in the rank color)
export const RANK_PILL_BG = [
  'bg-amber-400/10 ring-1 ring-amber-400/20',
  'bg-slate-300/10 ring-1 ring-slate-300/20',
  'bg-[#c89882]/10 ring-1 ring-[#c89882]/25',
];

// Diagonal "podium" linear-gradient tints (used by the home-page top-3 cards
// and the highlight cards on the investor profile). Heavier wash than the
// radial RANK_GRADIENT above so the card feels distinctly gold/silver/copper.
export const PODIUM_GRADIENT = [
  'linear-gradient(135deg, rgba(160, 147, 0, 0.08) 0%, rgba(255, 255, 255, 0) 45%)',
  'linear-gradient(135deg, rgba(255, 255, 255, 0.06) 0%, rgba(255, 255, 255, 0) 45%)',
  'linear-gradient(135deg, rgba(137, 93, 49, 0.08) 0%, rgba(255, 255, 255, 0) 45%)',
];

export const PODIUM_NUM_COLOR = ['text-amber-400', 'text-slate-200', 'text-[#cc6600]'];

// Subtle "raised" treatment for ordinal ranks (1st / 2nd / 3rd) — a gentle
// top-to-bottom gradient in the rank's hue (close color stops so the effect
// is just barely noticeable) plus a faint drop-shadow for a hint of depth.
// Apply via `style={PODIUM_NUM_STYLE[rank - 1]}`.
const PODIUM_NUM_BASE = {
  WebkitBackgroundClip: 'text',
  backgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
};

export const PODIUM_NUM_STYLE = [
  {
    ...PODIUM_NUM_BASE,
    backgroundImage: 'linear-gradient(180deg, #fde047 0%, #eab308 100%)',
    filter: 'drop-shadow(0 1px 0 rgba(0, 0, 0, 0.2))',
  },
  {
    ...PODIUM_NUM_BASE,
    backgroundImage: 'linear-gradient(180deg, #f1f5f9 0%, #94a3b8 100%)',
    filter: 'drop-shadow(0 1px 0 rgba(0, 0, 0, 0.18))',
  },
  {
    ...PODIUM_NUM_BASE,
    backgroundImage: 'linear-gradient(180deg, #fb923c 0%, #9a3412 100%)',
    filter: 'drop-shadow(0 1px 0 rgba(0, 0, 0, 0.2))',
  },
];

// rank is 1-indexed; returns null if not a podium rank.
// origin: 'tl' (default) for top-left or 'tr' for top-right gradient anchor.
export function rankStyle(rank, origin = 'tl') {
  if (!rank || rank < 1 || rank > 3) return null;
  const idx = rank - 1;
  const gradient = origin === 'tr' ? RANK_GRADIENT_TR[idx] : RANK_GRADIENT[idx];
  return {
    gradient,
    numColor: RANK_NUM_COLOR[idx],
    pillBg: RANK_PILL_BG[idx],
  };
}
