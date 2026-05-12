import { investors, METRICS } from '@/data/investors';

// Insights are limited to "higher is better" metrics — the three visible ones.
// Cohort must be at least MIN_COHORT to avoid trivially small slices
// (e.g. "#1 among 3 secondary funds in Austin").
const TOP_N = 10;
const MIN_COHORT = 20;

// Sort each metric once at module load — reused across all investor pages.
// Mirrors the ordering used by getFilteredInvestors so insights agree with the
// rankings table: CSV-derived ranks (lower is better) take precedence, with the
// raw metric value as a tiebreaker for investors not in the CSV-ranked set.
const LOWER_IS_BETTER = new Set(['m2', 'm7']);
const sortedByMetric = Object.fromEntries(
  Object.values(METRICS).map(m => {
    const lower = LOWER_IS_BETTER.has(m.id);
    return [
      m.id,
      [...investors].sort((a, b) => {
        const ar = a.ranks?.[m.id];
        const br = b.ranks?.[m.id];
        if (ar != null && br != null) return ar - br;
        if (ar != null) return -1;
        if (br != null) return 1;
        const av = a.metrics?.[m.id];
        const bv = b.metrics?.[m.id];
        const aVal = av == null ? (lower ? Infinity : -Infinity) : av;
        const bVal = bv == null ? (lower ? Infinity : -Infinity) : bv;
        return lower ? aVal - bVal : bVal - aVal;
      }),
    ];
  }),
);

// Cohort-size cache keyed by filter combo (so we don't recount per metric/per investor).
const cohortCache = new Map();

function matchesFilter(i, { type, stage, sector, geography }) {
  if (type && i.primaryType !== type) return false;
  if (stage && i.stage !== stage) return false;
  if (sector && i.sector !== sector) return false;
  if (geography && i.geography !== geography) return false;
  return true;
}

function cohortKey({ type = '', stage = '', sector = '', geography = '' }) {
  return `${type}|${stage}|${sector}|${geography}`;
}

function cohortSize(filter) {
  const key = cohortKey(filter);
  if (cohortCache.has(key)) return cohortCache.get(key);
  let n = 0;
  for (const i of investors) if (matchesFilter(i, filter)) n++;
  cohortCache.set(key, n);
  return n;
}

function rankIn(investor, metricId, filter) {
  let rank = 0;
  for (const i of sortedByMetric[metricId]) {
    if (!matchesFilter(i, filter)) continue;
    rank++;
    if (i.id === investor.id) return rank;
    if (rank > TOP_N) return null;
  }
  return null;
}

// Filter combinations to evaluate, one at a time. We check the broad
// "all investors" scope plus each of the investor's four metadata fields
// (type, stage, sector, geography) applied individually — so an investor
// can surface a top-10 placement in multiple narrower cohorts independently.
function combinationsFor(investor) {
  const t = investor.primaryType && investor.primaryType !== 'Other' ? investor.primaryType : null;
  const s = investor.stage && investor.stage !== 'Multi-Stage' ? investor.stage : null;
  const c = investor.sector && investor.sector !== 'Generalist' ? investor.sector : null;
  const g = investor.geography && investor.geography !== 'Global' ? investor.geography : null;

  const out = [{}];
  if (t) out.push({ type: t });
  if (s) out.push({ stage: s });
  if (c) out.push({ sector: c });
  if (g) out.push({ geography: g });
  return out;
}

function insightsForMetric(investor, metricId) {
  const out = [];
  for (const combo of combinationsFor(investor)) {
    if (cohortSize(combo) < MIN_COHORT) continue;
    const rank = rankIn(investor, metricId, combo);
    if (rank !== null && rank <= TOP_N) out.push({ metricId, rank, combo });
  }
  // If the investor is #1 among all investors for this metric, every
  // narrower-cohort insight would also be #1 — drop them to avoid clutter.
  const allInvestorsTop = out.find(
    ins => ins.rank === 1 && !ins.combo.type && !ins.combo.stage && !ins.combo.sector && !ins.combo.geography,
  );
  if (allInvestorsTop) return [allInvestorsTop];
  return out;
}

export function getInsights(investor) {
  const out = [];
  for (const metric of Object.values(METRICS)) {
    out.push(...insightsForMetric(investor, metric.id));
  }
  // Best ranks first (broader scopes naturally rank lower because the cohort
  // is larger, so this also tends to order broad-then-narrow per metric).
  out.sort((a, b) => a.rank - b.rank);
  return out;
}

// ---- Phrasing -----------------------------------------------------------

const TYPE_NOUN = {
  'Venture Capital': 'VCs',
  'Corporate Venture Capital': 'CVCs',
  'Accelerator Incubator': 'accelerators',
  'Angel Group': 'angel groups',
  'Individual Angel': 'angel investors',
  'Private Equity': 'PE firms',
  'Growth Equity': 'growth equity firms',
  'Hedge Fund': 'hedge funds',
  'Crossover Fund': 'crossover funds',
  'Asset Manager': 'asset managers',
  'Investment Bank': 'investment banks',
  'Family Office': 'family offices',
  'Sovereign Wealth Fund': 'sovereign wealth funds',
  'Government': 'government funds',
  'Endowment': 'endowments',
  'Pension Fund': 'pension funds',
  'Fund Of Funds': 'fund of funds',
  'Secondary Fund': 'secondary funds',
  'Private Debt': 'private debt funds',
  'Venture Studio': 'venture studios',
  'Strategic Corporate': 'strategic corporates',
};

const GEO_PHRASE = {
  'SF Bay Area': 'the SF Bay Area',
  'New York': 'New York',
  'Boston': 'Boston',
  'Los Angeles': 'Los Angeles',
  'Austin': 'Austin',
};

// Ordinal suffix for a positive integer (1 → 1st, 2 → 2nd, 3 → 3rd, 4 → 4th, …).
export function ordinal(n) {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return `${n}${s[(v - 20) % 10] || s[v] || s[0]}`;
}

// Same as ordinal() but returns the number and suffix separately, so callers
// can render the suffix (e.g. "st") at a different size or alignment.
export function ordinalParts(n) {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return { number: String(n), suffix: s[(v - 20) % 10] || s[v] || s[0] };
}

// Short "filter focus" label used on the highlight-card pill (top-right).
export function scopePillLabel(combo = {}) {
  if (combo.type) return `${combo.type} focus`;
  if (combo.stage) return `${combo.stage} focus`;
  if (combo.sector) return `${combo.sector} focus`;
  if (combo.geography) return `${combo.geography} focus`;
  return 'All';
}

export function scopeLabel({ type, stage, sector, geography } = {}) {
  if (!type && !stage && !sector && !geography) return 'among all investors';
  const subj = type ? TYPE_NOUN[type] ?? 'investors' : 'investors';
  const parts = [`among ${subj}`];
  if (sector) parts.push(`focused on ${sector}`);
  if (stage) parts.push(`at the ${stage} stage`);
  if (geography) parts.push(`in ${GEO_PHRASE[geography] ?? geography}`);
  return parts.join(' ');
}
