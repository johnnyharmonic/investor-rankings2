// Per-sector pill tints. Tailwind-friendly className strings — `bg-X/15 text-X-300 ring-X/20`.
// Keys match the SECTORS list in src/data/investors.js.

const TINTS = {
  'Aerospace and defense': 'bg-sky-500/10 text-sky-700 dark:text-sky-300 ring-sky-500/20',
  'Agriculture': 'bg-lime-500/10 text-lime-700 dark:text-lime-300 ring-lime-500/20',
  'Automotive and transportation': 'bg-blue-500/10 text-blue-700 dark:text-blue-300 ring-blue-500/20',
  'Business services': 'bg-zinc-500/15 text-zinc-700 dark:text-zinc-300 ring-zinc-500/25',
  'Communications and information technology': 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 ring-indigo-500/20',
  'Compliance and legal': 'bg-stone-500/15 text-stone-700 dark:text-stone-300 ring-stone-500/25',
  'Consulting': 'bg-neutral-500/15 text-neutral-700 dark:text-neutral-300 ring-neutral-500/25',
  'Consumer goods and retail': 'bg-pink-500/10 text-pink-700 dark:text-pink-300 ring-pink-500/20',
  'Consumer products and services': 'bg-rose-500/10 text-rose-700 dark:text-rose-300 ring-rose-500/20',
  'Cybersecurity': 'bg-red-500/10 text-red-700 dark:text-red-300 ring-red-500/20',
  'Education and research': 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-300 ring-yellow-500/20',
  'Energy and utilities': 'bg-amber-500/10 text-amber-700 dark:text-amber-300 ring-amber-500/20',
  'Enterprise productivity and automation': 'bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 ring-cyan-500/20',
  'Environment and sustainability': 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 ring-emerald-500/20',
  'Financial services': 'bg-teal-500/10 text-teal-700 dark:text-teal-300 ring-teal-500/20',
  'Government and public sector': 'bg-slate-500/15 text-slate-700 dark:text-slate-300 ring-slate-500/25',
  'Hospitality and tourism': 'bg-fuchsia-500/10 text-fuchsia-700 dark:text-fuchsia-300 ring-fuchsia-500/20',
  'Industrial and manufacturing': 'bg-orange-500/10 text-orange-700 dark:text-orange-300 ring-orange-500/20',
  'Legal and compliance services': 'bg-stone-500/15 text-stone-700 dark:text-stone-300 ring-stone-500/25',
  'Life sciences and healthcare': 'bg-green-500/10 text-green-700 dark:text-green-300 ring-green-500/20',
  'Materials': 'bg-stone-500/15 text-stone-700 dark:text-stone-300 ring-stone-500/25',
  'Media and entertainment': 'bg-violet-500/10 text-violet-700 dark:text-violet-300 ring-violet-500/20',
  'Private investing': 'bg-purple-500/10 text-purple-700 dark:text-purple-300 ring-purple-500/20',
  'Real estate and construction': 'bg-orange-500/10 text-orange-700 dark:text-orange-300 ring-orange-500/20',
  'Social impact': 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 ring-emerald-500/20',
  'Staffing recruitment and future of work': 'bg-blue-500/10 text-blue-700 dark:text-blue-300 ring-blue-500/20',
  'Transportation and logistics': 'bg-blue-500/10 text-blue-700 dark:text-blue-300 ring-blue-500/20',
  'Venture capital': 'bg-purple-500/10 text-purple-700 dark:text-purple-300 ring-purple-500/20',
  Generalist: 'bg-muted text-muted-foreground ring-border',
};

const DEFAULT_TINT = 'bg-muted text-muted-foreground ring-border';

export function sectorTint(name) {
  return TINTS[name] ?? DEFAULT_TINT;
}

// Stage tint — five stages, faint accent each.
const STAGE_TINTS = {
  'Pre-Seed': 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 ring-emerald-500/20',
  'Seed': 'bg-green-500/10 text-green-700 dark:text-green-300 ring-green-500/20',
  'Series A': 'bg-sky-500/10 text-sky-700 dark:text-sky-300 ring-sky-500/20',
  'Series B': 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 ring-indigo-500/20',
  'Series C+': 'bg-violet-500/10 text-violet-700 dark:text-violet-300 ring-violet-500/20',
  'Multi-Stage': 'bg-zinc-500/15 text-zinc-700 dark:text-zinc-300 ring-zinc-500/25',
};

export function stageTint(name) {
  return STAGE_TINTS[name] ?? DEFAULT_TINT;
}

// Investor type tint (primaryType from the data set).
const TYPE_TINTS = {
  'Venture Capital': 'bg-purple-500/10 text-purple-700 dark:text-purple-300 ring-purple-500/20',
  'Corporate Venture Capital': 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 ring-indigo-500/20',
  'Strategic Corporate': 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 ring-indigo-500/20',
  'Accelerator Incubator': 'bg-amber-500/10 text-amber-700 dark:text-amber-300 ring-amber-500/20',
  'Angel Group': 'bg-pink-500/10 text-pink-700 dark:text-pink-300 ring-pink-500/20',
  'Individual Angel': 'bg-pink-500/10 text-pink-700 dark:text-pink-300 ring-pink-500/20',
  'Private Equity': 'bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 ring-cyan-500/20',
  'Growth Equity': 'bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 ring-cyan-500/20',
  'Hedge Fund': 'bg-teal-500/10 text-teal-700 dark:text-teal-300 ring-teal-500/20',
  'Crossover Fund': 'bg-teal-500/10 text-teal-700 dark:text-teal-300 ring-teal-500/20',
  'Asset Manager': 'bg-blue-500/10 text-blue-700 dark:text-blue-300 ring-blue-500/20',
  'Investment Bank': 'bg-blue-500/10 text-blue-700 dark:text-blue-300 ring-blue-500/20',
  'Family Office': 'bg-fuchsia-500/10 text-fuchsia-700 dark:text-fuchsia-300 ring-fuchsia-500/20',
  'Sovereign Wealth Fund': 'bg-violet-500/10 text-violet-700 dark:text-violet-300 ring-violet-500/20',
  'Government': 'bg-violet-500/10 text-violet-700 dark:text-violet-300 ring-violet-500/20',
  'Endowment': 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-300 ring-yellow-500/20',
  'Pension Fund': 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-300 ring-yellow-500/20',
  'Fund Of Funds': 'bg-stone-500/15 text-stone-700 dark:text-stone-300 ring-stone-500/25',
  'Secondary Fund': 'bg-stone-500/15 text-stone-700 dark:text-stone-300 ring-stone-500/25',
  'Private Debt': 'bg-orange-500/10 text-orange-700 dark:text-orange-300 ring-orange-500/20',
  'Venture Studio': 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 ring-emerald-500/20',
  'Other': DEFAULT_TINT,
};

// Short label for very narrow columns.
const TYPE_SHORT = {
  'Venture Capital': 'VC',
  'Corporate Venture Capital': 'CVC',
  'Strategic Corporate': 'Corp',
  'Accelerator Incubator': 'Accel',
  'Angel Group': 'Angel',
  'Individual Angel': 'Angel',
  'Private Equity': 'PE',
  'Growth Equity': 'Growth',
  'Hedge Fund': 'Hedge',
  'Crossover Fund': 'Crossover',
  'Asset Manager': 'Asset',
  'Investment Bank': 'IB',
  'Family Office': 'Family Office',
  'Sovereign Wealth Fund': 'SWF',
  'Government': 'Gov',
  'Endowment': 'Endow',
  'Pension Fund': 'Pension',
  'Fund Of Funds': 'FoF',
  'Secondary Fund': 'Secondary',
  'Private Debt': 'Debt',
  'Venture Studio': 'Studio',
  'Other': 'Other',
};

export function typeTint(name) {
  return TYPE_TINTS[name] ?? DEFAULT_TINT;
}

export function typeShort(name) {
  return TYPE_SHORT[name] ?? name;
}
