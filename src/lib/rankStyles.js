// Shared rank-1/2/3 visual treatments (gold / silver / copper)

// Top-left origin (default — used in row-style lists)
export const RANK_GRADIENT = [
  'radial-gradient(circle at 0% 0%, rgba(250, 204, 21, 0.08), transparent 45%)',
  'radial-gradient(circle at 0% 0%, rgba(226, 232, 240, 0.06), transparent 45%)',
  'radial-gradient(circle at 0% 0%, rgba(217, 119, 6, 0.07), transparent 45%)',
];

// Top-right origin (used in card-style tiles where the rank pill sits in the top-right)
export const RANK_GRADIENT_TR = [
  'radial-gradient(circle at 100% 0%, rgba(250, 204, 21, 0.08), transparent 45%)',
  'radial-gradient(circle at 100% 0%, rgba(226, 232, 240, 0.06), transparent 45%)',
  'radial-gradient(circle at 100% 0%, rgba(217, 119, 6, 0.07), transparent 45%)',
];

export const RANK_NUM_COLOR = ['text-amber-400', 'text-slate-300', 'text-[#c89882]'];

// Pill backgrounds (very subtle tints in the rank color)
export const RANK_PILL_BG = [
  'bg-amber-400/10 ring-1 ring-amber-400/20',
  'bg-slate-300/10 ring-1 ring-slate-300/20',
  'bg-[#c89882]/10 ring-1 ring-[#c89882]/25',
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
