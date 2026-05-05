// scripts/build-investors.mjs
//
// One-shot migration script: reads the 15 CSV ranking files in
// .context/attachments/, dedupes investors by URN, synthesizes the
// mock fields the existing UI expects (stage, sector, geography,
// founded, aum, description, notablePortfolio), and rewrites
// src/data/investors.js.
//
// Run: `node scripts/build-investors.mjs`

import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const CSV_DIR = join(ROOT, '.context/attachments');
const OUT = join(ROOT, 'src/data/investors.js');

// ---------- Filter constants (kept identical to the existing app) ----------

const STAGES = ['All stage focus', 'Pre-Seed', 'Seed', 'Series A', 'Series B', 'Series C+', 'Multi-Stage'];

const SECTORS = [
  'All sector focus',
  'Aerospace and defense',
  'Agriculture',
  'Automotive and transportation',
  'Business services',
  'Communications and information technology',
  'Compliance and legal',
  'Consulting',
  'Consumer goods and retail',
  'Consumer products and services',
  'Cybersecurity',
  'Education and research',
  'Energy and utilities',
  'Enterprise productivity and automation',
  'Environment and sustainability',
  'Financial services',
  'Government and public sector',
  'Hospitality and tourism',
  'Industrial and manufacturing',
  'Legal and compliance services',
  'Life sciences and healthcare',
  'Materials',
  'Media and entertainment',
  'Private investing',
  'Real estate and construction',
  'Social impact',
  'Staffing recruitment and future of work',
  'Transportation and logistics',
  'Venture capital',
];

const GEOGRAPHIES = ['All country focus', 'SF Bay Area', 'New York', 'Boston', 'Los Angeles', 'Austin', 'Global'];
const US_GEOS = ['SF Bay Area', 'New York', 'Boston', 'Los Angeles', 'Austin'];

// ---------- Updated METRICS labels (CSV-aligned) ----------

const METRICS_OBJ = {
  m1: { id: 'm1', label: 'Next round prob.', fullLabel: 'Next round probability', unit: '%', description: "Probability that a portfolio company raises at least one additional round after the investor's entry." },
  m2: { id: 'm2', label: 'Time to next round', fullLabel: 'Median time to next round', unit: 'mo', description: "Median months between the investor's entry round and the company's next financing round." },
  m3: { id: 'm3', label: 'Follow-on prob.', fullLabel: 'Follow-on probability', unit: '%', description: "Probability that the investor participates in the company's next round." },
  m4: { id: 'm4', label: 'Deal size scale-up', fullLabel: 'Scale-up rate (deal size)', unit: '%', description: 'Share of portfolio companies whose next round had a larger deal size than the entry round.' },
  m5: { id: 'm5', label: 'Valuation scale-up', fullLabel: 'Scale-up rate (valuation)', unit: '%', caveat: true, description: 'Share of portfolio companies whose next round had a higher post-money valuation. Note: valuation estimates carry a higher error rate.' },
  m6: { id: 'm6', label: 'Exit prob.', fullLabel: 'Exit probability', unit: '%', description: 'Probability that a portfolio company eventually experiences an exit-type deal (IPO or M&A).' },
  m7: { id: 'm7', label: 'Time to exit', fullLabel: 'Median time to exit', unit: 'mo', description: "Median months between the investor's entry and the company's exit event (IPO or M&A)." },
  m8: { id: 'm8', label: 'Unicorn conversion', fullLabel: 'Unicorn conversion rate', unit: '%', description: 'Probability that a portfolio company reaches a valuation of $1B or above.' },
  m9: { id: 'm9', label: 'Unicorn exit rate', fullLabel: 'Unicorn exit rate', unit: '%', description: 'Probability that a unicorn in which the investor has invested goes through an exit-type deal.' },
};

// ---------- CSV parser (handles quoted fields with embedded commas) ----------

function parseCSV(text) {
  const rows = [];
  let row = [];
  let cell = '';
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') { cell += '"'; i++; } // escaped quote
        else inQuotes = false;
      } else cell += c;
    } else {
      if (c === '"') inQuotes = true;
      else if (c === ',') { row.push(cell); cell = ''; }
      else if (c === '\n' || c === '\r') {
        if (cell.length || row.length) { row.push(cell); rows.push(row); row = []; cell = ''; }
        if (c === '\r' && text[i + 1] === '\n') i++; // CRLF
      } else cell += c;
    }
  }
  if (cell.length || row.length) { row.push(cell); rows.push(row); }
  return rows;
}

function rowsToObjects(rows) {
  const [header, ...data] = rows;
  return data.map(r => {
    const o = {};
    header.forEach((h, i) => (o[h] = r[i]));
    return o;
  });
}

// ---------- Deterministic synth helpers ----------

function hashString(s) {
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h) ^ s.charCodeAt(i); // djb2 xor
  return h >>> 0; // unsigned
}

function pick(arr, seed) { return arr[seed % arr.length]; }

function synthDescription(primaryType) {
  const t = (primaryType || '').toLowerCase();
  if (t.includes('venture')) return 'Venture capital firm investing across early- and growth-stage companies.';
  if (t.includes('growth')) return 'Growth equity firm partnering with scale-stage technology companies.';
  if (t.includes('family')) return 'Family office deploying capital across private and public markets.';
  if (t.includes('angel')) return 'Active angel investor backing early-stage founders.';
  if (t.includes('corporate')) return 'Corporate venture arm investing strategically in emerging companies.';
  if (t.includes('accelerator')) return 'Accelerator program supporting early-stage founders with capital and mentorship.';
  if (t.includes('hedge')) return 'Hedge fund with a private investment program in late-stage growth companies.';
  if (t.includes('private equity')) return 'Private equity firm investing in established, cash-flow positive companies.';
  return 'Active investor across the venture and growth ecosystem.';
}

function synthAum(seed) {
  // bucketed: weighted toward smaller funds
  const buckets = ['$250M', '$500M', '$1B', '$2B', '$5B', '$10B', '$20B', '$50B'];
  return buckets[seed % buckets.length];
}

// ---------- URL / domain helpers ----------

function extractDomain(url) {
  if (!url) return null;
  try {
    const u = new URL(url.trim());
    return u.hostname.replace(/^www\./, '') || null;
  } catch {
    return null;
  }
}

function extractYear(date) {
  if (!date) return null;
  const m = String(date).match(/^(\d{4})/);
  return m ? Number(m[1]) : null;
}

function urnToId(urn) {
  const m = String(urn || '').match(/(\d+)$/);
  return m ? Number(m[1]) : null;
}

// ---------- Numeric helpers ----------

function num(v) {
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

function pct(v) {
  const n = num(v);
  return n === null ? null : Math.round(n * 100);
}

function months(v) {
  const n = num(v);
  return n === null ? null : Math.round(n);
}

// ---------- Main build ----------

// Map filename → metric id (skip sub-variants M4a/b/c, M5a/b/c per plan)
function fileToMetric(filename) {
  const m = filename.match(/^ranking_M(\d+)([a-c]?)\./i);
  if (!m) return null;
  if (m[2]) return null; // skip a/b/c sub-variants
  return `m${m[1]}`;
}

const csvFiles = readdirSync(CSV_DIR).filter(f => /^ranking_M.*\.csv$/i.test(f));
if (!csvFiles.length) throw new Error(`No ranking_M*.csv found in ${CSV_DIR}`);

console.log(`Reading ${csvFiles.length} CSVs from ${CSV_DIR}…`);

// Per-investor record now also tracks per-metric rank from each CSV
const byUrn = new Map();
for (const f of csvFiles) {
  const metricId = fileToMetric(f);
  const text = readFileSync(join(CSV_DIR, f), 'utf8');
  const rows = parseCSV(text);
  const objs = rowsToObjects(rows);
  for (const o of objs) {
    if (!o.investor_urn) continue;
    let rec = byUrn.get(o.investor_urn);
    if (!rec) {
      rec = { ...o, ranks: {} };
      byUrn.set(o.investor_urn, rec);
    }
    if (metricId) {
      const rk = Number(o.rank);
      if (Number.isFinite(rk)) rec.ranks[metricId] = rk;
    }
  }
}
console.log(`Found ${byUrn.size} unique investors across all CSVs.`);

const records = [];
for (const o of byUrn.values()) {
  const id = urnToId(o.investor_urn);
  if (!id) continue;
  const seed = hashString(String(o.investor_urn));
  const name = o.investor_name || '';
  const slug = String(id);

  // Real metric values
  const m1v = pct(o.m1_prob_next_round);
  const m2v = months(o.m2_median_months_to_next_round);
  const m3v = pct(o.m3_follow_on_prob);
  const m4v = pct(o.m4_share_scale_up);
  const m5v = pct(o.m5_share_scale_up);
  const m6v = pct(o.m6_exit_prob);
  const m7v = months(o.m7_median_months_to_exit);
  const m8v = pct(o.m8_unicorn_conversion_rate);
  const m9v = pct(o.m9_unicorn_exit_rate);
  const metrics = { m1: m1v, m2: m2v, m3: m3v, m4: m4v, m5: m5v, m6: m6v, m7: m7v, m8: m8v, m9: m9v };

  // Real breakdown counts
  const m4Denom = num(o.m4_n_deals_eligible);
  const m5Denom = num(o.m5_n_deals_eligible);
  const m1Num = num(o.m1_n_companies_with_next_round);
  const m6Num = num(o.m6_n_exit_companies);

  const breakdown = {};
  if (num(o.m1_n_companies_eligible) !== null && m1Num !== null) {
    breakdown.m1 = { num: m1Num, denom: num(o.m1_n_companies_eligible) };
  }
  if (num(o.m3_n_companies_eligible) !== null && num(o.m3_n_companies_followed_on) !== null) {
    breakdown.m3 = { num: num(o.m3_n_companies_followed_on), denom: num(o.m3_n_companies_eligible) };
  }
  if (m4Denom !== null && num(o.m4_share_scale_up) !== null) {
    breakdown.m4 = { num: Math.round(num(o.m4_share_scale_up) * m4Denom), denom: m4Denom };
  }
  if (m5Denom !== null && num(o.m5_share_scale_up) !== null) {
    breakdown.m5 = { num: Math.round(num(o.m5_share_scale_up) * m5Denom), denom: m5Denom };
  }
  if (m6Num !== null && num(o.m6_n_companies_total) !== null) {
    breakdown.m6 = { num: m6Num, denom: num(o.m6_n_companies_total) };
  }
  if (num(o.m8_n_unicorn_companies) !== null && num(o.m8_n_companies_eligible) !== null) {
    breakdown.m8 = { num: num(o.m8_n_unicorn_companies), denom: num(o.m8_n_companies_eligible) };
  }
  if (num(o.m9_n_unicorn_exited_companies) !== null && num(o.m9_n_unicorn_companies) !== null) {
    breakdown.m9 = { num: num(o.m9_n_unicorn_exited_companies), denom: num(o.m9_n_unicorn_companies) };
  }
  if (m1Num !== null) breakdown.m2 = { denom: m1Num };
  if (m6Num !== null) breakdown.m7 = { denom: m6Num };

  // Real connection metadata
  const domain = extractDomain(o.investor_website_url);
  const linkedinUrl = (o.investor_linkedin_url || '').trim() || null;
  const hqCountry = (o.investor_HQCountry || '').trim() || null;
  const hqRegion = (o.investor_HQRegion || '').trim() || null;
  const primaryType = (o.investor_primary_type || '').trim() || null;
  const firstYear = extractYear(o.first_deal_date);

  // Synthesized mock fields (deterministic per investor)
  const stage = pick(STAGES.slice(1), seed);
  const sector = pick(SECTORS.slice(1), seed >> 4);
  const geography = hqCountry === 'United States'
    ? pick(US_GEOS, seed >> 8)
    : 'Global';
  const founded = 1995 + ((seed >> 12) % 26);
  const aum = synthAum((seed >> 16));
  const description = synthDescription(primaryType);

  records.push({
    id,
    slug,
    name,
    fund: name,
    logo: (name[0] || '?').toUpperCase(),
    domain,
    linkedinUrl,
    primaryType,
    hqRegion,
    hqCountry,
    firstYear,
    stage,
    sector,
    geography,
    founded,
    aum,
    notablePortfolio: [],
    description,
    metrics,
    breakdown,
    ranks: o.ranks || {},
  });
}

// Composite score = mean of percentage metrics
const PCT_METRICS = ['m1', 'm3', 'm4', 'm5', 'm6', 'm8', 'm9'];
for (const r of records) {
  const vals = PCT_METRICS.map(m => r.metrics[m]).filter(v => typeof v === 'number');
  r.compositeScore = vals.length ? Math.round(vals.reduce((a, b) => a + b, 0) / vals.length) : 0;
}

records.sort((a, b) => b.compositeScore - a.compositeScore);
records.forEach((r, i) => (r.rank = i + 1));

// ---------- Emit src/data/investors.js ----------

function js(value) { return JSON.stringify(value); }

const sortedKeys = ['id','slug','name','fund','logo','domain','linkedinUrl','primaryType','hqRegion','hqCountry','firstYear','stage','sector','geography','founded','aum','notablePortfolio','description','metrics','breakdown','ranks','compositeScore','rank'];

function serializeRecord(r) {
  const lines = sortedKeys.map(k => {
    const v = r[k];
    return `    ${k}: ${js(v)}`;
  });
  return `  {\n${lines.join(',\n')},\n  }`;
}

const out = `// AUTO-GENERATED by scripts/build-investors.mjs — do not edit by hand.
// Source: .context/attachments/ranking_M*.csv (Harmonic + UChicago, VC, all countries, 2015 vintage, top 100 per metric).
// Re-run \`node scripts/build-investors.mjs\` after refreshing the CSVs.

export const METRICS = ${JSON.stringify(METRICS_OBJ, null, 2)};

export const STAGES = ${JSON.stringify(STAGES)};
export const SECTORS = ${JSON.stringify(SECTORS, null, 2)};
export const GEOGRAPHIES = ${JSON.stringify(GEOGRAPHIES)};

export const investors = [
${records.map(serializeRecord).join(',\n')},
];

export function getInvestorBySlug(slug) {
  return investors.find(i => i.slug === slug) || null;
}

export function getMetricBreakdown(investor, metricId) {
  const b = investor.breakdown?.[metricId];
  if (!b) return null;
  if (metricId === 'm2') return { text: \`Across \${b.denom} rounds\` };
  if (metricId === 'm7') return { text: \`Across \${b.denom} exits\` };
  if (metricId === 'm9') return { text: \`\${b.num} / \${b.denom} unicorns\` };
  if (metricId === 'm4' || metricId === 'm5') return { text: \`\${b.num} / \${b.denom} rounds\` };
  return { text: \`\${b.num} / \${b.denom} portcos\` };
}

function normalizeFilter(value, sentinel) {
  if (Array.isArray(value)) return value.filter(v => v && v !== sentinel);
  if (typeof value === 'string' && value && value !== sentinel) return [value];
  return [];
}

export function getFilteredInvestors({ stage, sector, geography, search, sortBy, sortDir }) {
  let result = [...investors];

  const stages = normalizeFilter(stage, 'All stage focus');
  const sectors = normalizeFilter(sector, 'All sector focus');
  const geos = normalizeFilter(geography, 'All country focus');

  if (stages.length) {
    result = result.filter(i => stages.includes(i.stage) || i.stage === 'Multi-Stage');
  }
  if (sectors.length) {
    result = result.filter(i => sectors.includes(i.sector) || i.sector === 'Generalist');
  }
  if (geos.length) {
    result = result.filter(i => geos.includes(i.geography));
  }
  if (search) {
    const q = search.toLowerCase();
    result = result.filter(i =>
      i.name.toLowerCase().includes(q) ||
      (i.fund || '').toLowerCase().includes(q)
    );
  }
  if (sortBy && sortBy !== 'rank') {
    if (sortBy in METRICS) {
      // Per-metric sort: use the CSV-derived rank when present (1 = best),
      // and fall back to the raw metric value for investors not in that
      // metric's top-100 CSV. Investors with no data sink to the bottom.
      const lowerIsBetter = ['m2', 'm7'].includes(sortBy);
      result.sort((a, b) => {
        const ar = a.ranks?.[sortBy];
        const br = b.ranks?.[sortBy];
        // Both ranked: lower rank wins regardless of direction (rank 1 is best)
        if (ar != null && br != null) return sortDir === 'asc' ? br - ar : ar - br;
        if (ar != null) return sortDir === 'asc' ? 1 : -1;
        if (br != null) return sortDir === 'asc' ? -1 : 1;
        // Neither ranked: fall back to raw metric value
        const av = a.metrics?.[sortBy];
        const bv = b.metrics?.[sortBy];
        const aVal = av == null ? (lowerIsBetter ? Infinity : -Infinity) : av;
        const bVal = bv == null ? (lowerIsBetter ? Infinity : -Infinity) : bv;
        const diff = lowerIsBetter ? aVal - bVal : bVal - aVal;
        return sortDir === 'asc' ? -diff : diff;
      });
    } else {
      result.sort((a, b) => {
        const av = a[sortBy];
        const bv = b[sortBy];
        const diff = (bv ?? 0) - (av ?? 0);
        return sortDir === 'asc' ? -diff : diff;
      });
    }
  }

  return result;
}
`;

writeFileSync(OUT, out, 'utf8');
console.log(`Wrote ${OUT} with ${records.length} investors.`);

function topNByRank(metric, n) {
  return [...records]
    .filter(r => r.ranks?.[metric] != null)
    .sort((a, b) => a.ranks[metric] - b.ranks[metric])
    .slice(0, n)
    .map(r => `${r.name} (rank ${r.ranks[metric]})`);
}
console.log(`Top by m1: ${topNByRank('m1', 3).join(', ')}`);
console.log(`Top by m2: ${topNByRank('m2', 3).join(', ')}`);
console.log(`Top by m9: ${topNByRank('m9', 3).join(', ')}`);
