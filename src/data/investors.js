// Mock investor data — replace with real Harmonic data feed post-DQA
// Metrics: M1–M9 as defined in the PRD

export const METRICS = {
  m1: { id: 'm1', label: 'Follow-on prob.', fullLabel: 'Follow-on probability', unit: '%', description: 'Probability that a portfolio company raises at least one additional round after the investor\'s initial entry.' },
  m2: { id: 'm2', label: 'Financing velocity', fullLabel: 'Financing velocity', unit: 'mo', description: 'Median months between the investor\'s entry round and the company\'s next financing round.' },
  m3: { id: 'm3', label: 'Investor follow-on', fullLabel: 'Investor follow-on rate', unit: '%', description: 'Probability that the investor participates in the company\'s next round following its initial investment.' },
  m4: { id: 'm4', label: 'Deal step-up', fullLabel: 'Deal size step-up rate', unit: '%', description: 'Share of portfolio companies that experience an increase in deal size in the first round immediately following the investor\'s entry.' },
  m5: { id: 'm5', label: 'Valuation step-up', fullLabel: 'Valuation step-up rate', unit: '%', caveat: true, description: 'Share of portfolio companies with an increase in post-money valuation in the next round. Note: valuation estimates carry a higher error rate.' },
  m6: { id: 'm6', label: 'Exit probability', fullLabel: 'Exit probability', unit: '%', description: 'Probability that a portfolio company eventually experiences an exit-type deal (IPO or M&A).' },
  m7: { id: 'm7', label: 'Time to exit', fullLabel: 'Time to exit', unit: 'mo', description: 'Median months between the investor\'s entry and the company\'s exit event (IPO or M&A).' },
  m8: { id: 'm8', label: 'Unicorn prob.', fullLabel: 'Unicorn probability', unit: '%', description: 'Probability that a portfolio company reaches a valuation of $1B or above.' },
  m9: { id: 'm9', label: 'Unicorn exit rate', fullLabel: 'Unicorn exit rate', unit: '%', description: 'Probability that a unicorn in which the investor has invested goes through an exit-type deal.' },
};

export const STAGES = ['All stages', 'Pre-Seed', 'Seed', 'Series A', 'Series B', 'Series C+', 'Multi-Stage'];
export const SECTORS = ['All sectors', 'Enterprise SaaS', 'Consumer', 'Fintech', 'Healthcare', 'Deep Tech', 'Infrastructure', 'Generalist'];
export const GEOGRAPHIES = ['All geographies', 'SF Bay Area', 'New York', 'Boston', 'Los Angeles', 'Austin', 'Global'];

export const investors = [
  {
    id: 1,
    slug: 'sequoia-capital',
    name: 'Sequoia Capital',
    fund: 'Sequoia Capital',
    logo: 'S',
    domain: 'sequoiacap.com',
    stage: 'Multi-Stage',
    sector: 'Generalist',
    geography: 'SF Bay Area',
    aum: '$85B',
    founded: 1972,
    notablePortfolio: ['Apple', 'Google', 'Stripe', 'Airbnb', 'WhatsApp'],
    description: 'One of Silicon Valley\'s most storied venture firms, backing companies from seed through growth.',
    metrics: { m1: 82, m2: 14, m3: 68, m4: 74, m5: 79, m6: 38, m7: 96, m8: 22, m9: 71 },
    compositeScore: 94,
    rank: 1,
  },
  {
    id: 2,
    slug: 'andreessen-horowitz',
    name: 'Andreessen Horowitz',
    fund: 'a16z',
    logo: 'a',
    domain: 'a16z.com',
    stage: 'Multi-Stage',
    sector: 'Generalist',
    geography: 'SF Bay Area',
    aum: '$42B',
    founded: 2009,
    notablePortfolio: ['GitHub', 'Lyft', 'Coinbase', 'Roblox', 'Figma'],
    description: 'Full-stack VC firm known for operational support and media presence alongside capital.',
    metrics: { m1: 80, m2: 15, m3: 61, m4: 71, m5: 76, m6: 35, m7: 102, m8: 20, m9: 68 },
    compositeScore: 91,
    rank: 2,
  },
  {
    id: 3,
    slug: 'accel',
    name: 'Accel',
    fund: 'Accel Partners',
    logo: 'A',
    domain: 'accel.com',
    stage: 'Series A',
    sector: 'Enterprise SaaS',
    geography: 'SF Bay Area',
    aum: '$16B',
    founded: 1983,
    notablePortfolio: ['Facebook', 'Slack', 'Dropbox', 'CrowdStrike', 'Braintree'],
    description: 'Early-stage specialist with deep enterprise software expertise across US and Europe.',
    metrics: { m1: 79, m2: 13, m3: 64, m4: 73, m5: 77, m6: 37, m7: 91, m8: 19, m9: 65 },
    compositeScore: 90,
    rank: 3,
  },
  {
    id: 4,
    slug: 'benchmark',
    name: 'Benchmark',
    fund: 'Benchmark Capital',
    logo: 'B',
    domain: 'benchmark.com',
    stage: 'Seed',
    sector: 'Generalist',
    geography: 'SF Bay Area',
    aum: '$3B',
    founded: 1995,
    notablePortfolio: ['Uber', 'Twitter', 'Snap', 'eBay', 'Stitch Fix'],
    description: 'Lean, partner-driven firm known for founder-friendly terms and hands-on early-stage support.',
    metrics: { m1: 77, m2: 12, m3: 59, m4: 70, m5: 74, m6: 36, m7: 88, m8: 21, m9: 67 },
    compositeScore: 89,
    rank: 4,
  },
  {
    id: 5,
    slug: 'founders-fund',
    name: 'Founders Fund',
    fund: 'Founders Fund',
    logo: 'F',
    domain: 'foundersfund.com',
    stage: 'Multi-Stage',
    sector: 'Deep Tech',
    geography: 'SF Bay Area',
    aum: '$11B',
    founded: 2005,
    notablePortfolio: ['SpaceX', 'Palantir', 'Airbnb', 'Lyft', 'Stripe'],
    description: 'Contrarian deep-tech fund co-founded by Peter Thiel, focused on transformative technology.',
    metrics: { m1: 75, m2: 18, m3: 55, m4: 67, m5: 72, m6: 40, m7: 110, m8: 24, m9: 73 },
    compositeScore: 88,
    rank: 5,
  },
  {
    id: 6,
    slug: 'kleiner-perkins',
    name: 'Kleiner Perkins',
    fund: 'Kleiner Perkins',
    logo: 'K',
    domain: 'kleinerperkins.com',
    stage: 'Series A',
    sector: 'Enterprise SaaS',
    geography: 'SF Bay Area',
    aum: '$9B',
    founded: 1972,
    notablePortfolio: ['Amazon', 'Google', 'Genentech', 'Twitter', 'DoorDash'],
    description: 'Legendary firm with deep roots in Silicon Valley, now focused on enterprise and health tech.',
    metrics: { m1: 74, m2: 16, m3: 57, m4: 65, m5: 70, m6: 36, m7: 99, m8: 18, m9: 62 },
    compositeScore: 86,
    rank: 6,
  },
  {
    id: 7,
    slug: 'greylock',
    name: 'Greylock',
    fund: 'Greylock Partners',
    logo: 'G',
    domain: 'greylock.com',
    stage: 'Series A',
    sector: 'Enterprise SaaS',
    geography: 'SF Bay Area',
    aum: '$3.5B',
    founded: 1965,
    notablePortfolio: ['LinkedIn', 'Airbnb', 'Discord', 'Roblox', 'Palo Alto Networks'],
    description: 'Operator-led firm with strong network effects and enterprise software depth.',
    metrics: { m1: 76, m2: 14, m3: 60, m4: 69, m5: 73, m6: 34, m7: 94, m8: 17, m9: 60 },
    compositeScore: 85,
    rank: 7,
  },
  {
    id: 8,
    slug: 'index-ventures',
    name: 'Index Ventures',
    fund: 'Index Ventures',
    logo: 'I',
    domain: 'indexventures.com',
    stage: 'Series A',
    sector: 'Generalist',
    geography: 'New York',
    aum: '$6B',
    founded: 1996,
    notablePortfolio: ['Dropbox', 'Robinhood', 'Etsy', 'Slack', 'Figma'],
    description: 'Transatlantic firm with strong operator networks across US and Europe.',
    metrics: { m1: 73, m2: 15, m3: 58, m4: 66, m5: 71, m6: 33, m7: 98, m8: 16, m9: 59 },
    compositeScore: 84,
    rank: 8,
  },
  {
    id: 9,
    slug: 'general-catalyst',
    name: 'General Catalyst',
    fund: 'General Catalyst',
    logo: 'GC',
    domain: 'generalcatalyst.com',
    stage: 'Multi-Stage',
    sector: 'Healthcare',
    geography: 'Boston',
    aum: '$25B',
    founded: 2000,
    notablePortfolio: ['Airbnb', 'Snap', 'Stripe', 'Oscar Health', 'Livongo'],
    description: 'Global firm increasingly focused on healthcare transformation and resilience.',
    metrics: { m1: 72, m2: 16, m3: 56, m4: 64, m5: 69, m6: 35, m7: 101, m8: 18, m9: 63 },
    compositeScore: 83,
    rank: 9,
  },
  {
    id: 10,
    slug: 'lightspeed-venture-partners',
    name: 'Lightspeed',
    fund: 'Lightspeed Venture Partners',
    logo: 'L',
    domain: 'lsvp.com',
    stage: 'Seed',
    sector: 'Enterprise SaaS',
    geography: 'SF Bay Area',
    aum: '$18B',
    founded: 2000,
    notablePortfolio: ['Snapchat', 'AppDynamics', 'MuleSoft', 'Nutanix', 'Rubrik'],
    description: 'Multi-stage global firm with a strong track record in enterprise and consumer.',
    metrics: { m1: 71, m2: 14, m3: 57, m4: 65, m5: 68, m6: 32, m7: 93, m8: 16, m9: 58 },
    compositeScore: 82,
    rank: 10,
  },
  {
    id: 11,
    slug: 'union-square-ventures',
    name: 'Union Square Ventures',
    fund: 'Union Square Ventures',
    logo: 'U',
    domain: 'usv.com',
    stage: 'Seed',
    sector: 'Consumer',
    geography: 'New York',
    aum: '$1.8B',
    founded: 2003,
    notablePortfolio: ['Twitter', 'Tumblr', 'Etsy', 'Duolingo', 'Cloudflare'],
    description: 'Thesis-driven early-stage fund with a focus on network effects and open systems.',
    metrics: { m1: 70, m2: 13, m3: 55, m4: 63, m5: 67, m6: 33, m7: 90, m8: 15, m9: 57 },
    compositeScore: 81,
    rank: 11,
  },
  {
    id: 12,
    slug: 'tiger-global',
    name: 'Tiger Global',
    fund: 'Tiger Global Management',
    logo: 'T',
    domain: 'tigerglobal.com',
    stage: 'Series B',
    sector: 'Generalist',
    geography: 'New York',
    aum: '$95B',
    founded: 2001,
    notablePortfolio: ['Facebook', 'LinkedIn', 'Spotify', 'Bytedance', 'Nubank'],
    description: 'Prolific crossover fund known for fast decisions and large check sizes.',
    metrics: { m1: 68, m2: 11, m3: 42, m4: 61, m5: 65, m6: 30, m7: 87, m8: 17, m9: 60 },
    compositeScore: 79,
    rank: 12,
  },
  {
    id: 13,
    slug: 'first-round-capital',
    name: 'First Round Capital',
    fund: 'First Round Capital',
    logo: '1R',
    domain: 'firstround.com',
    stage: 'Pre-Seed',
    sector: 'Generalist',
    geography: 'New York',
    aum: '$3B',
    founded: 2004,
    notablePortfolio: ['Uber', 'Square', 'Warby Parker', 'Roblox', 'Notion'],
    description: 'Pre-seed specialist with a strong community platform for portfolio founders.',
    metrics: { m1: 69, m2: 12, m3: 53, m4: 62, m5: 66, m6: 31, m7: 92, m8: 14, m9: 55 },
    compositeScore: 78,
    rank: 13,
  },
  {
    id: 14,
    slug: 'nea',
    name: 'NEA',
    fund: 'New Enterprise Associates',
    logo: 'N',
    domain: 'nea.com',
    stage: 'Multi-Stage',
    sector: 'Healthcare',
    geography: 'Boston',
    aum: '$25B',
    founded: 1977,
    notablePortfolio: ['Salesforce', 'Workday', 'Tableau', 'Coursera', 'Robinhood'],
    description: 'One of the largest global VC firms, active from seed through growth.',
    metrics: { m1: 67, m2: 17, m3: 51, m4: 60, m5: 64, m6: 32, m7: 105, m8: 15, m9: 56 },
    compositeScore: 77,
    rank: 14,
  },
  {
    id: 15,
    slug: 'insight-partners',
    name: 'Insight Partners',
    fund: 'Insight Partners',
    logo: 'IP',
    domain: 'insightpartners.com',
    stage: 'Series B',
    sector: 'Enterprise SaaS',
    geography: 'New York',
    aum: '$90B',
    founded: 1995,
    notablePortfolio: ['Twitter', 'HelloFresh', 'Shopify', 'Qualtrics', 'Wix'],
    description: 'Growth-stage specialist with operational ScaleUp program for portfolio companies.',
    metrics: { m1: 66, m2: 13, m3: 50, m4: 63, m5: 67, m6: 33, m7: 89, m8: 15, m9: 57 },
    compositeScore: 76,
    rank: 15,
  },
  {
    id: 16,
    slug: 'bessemer-venture-partners',
    name: 'Bessemer Venture Partners',
    fund: 'Bessemer Venture Partners',
    logo: 'BV',
    domain: 'bvp.com',
    stage: 'Series A',
    sector: 'Enterprise SaaS',
    geography: 'SF Bay Area',
    aum: '$17B',
    founded: 1911,
    notablePortfolio: ['LinkedIn', 'Pinterest', 'Shopify', 'Twilio', 'Yelp'],
    description: 'One of the oldest VC firms, known for cloud/SaaS investment thesis.',
    metrics: { m1: 68, m2: 15, m3: 52, m4: 62, m5: 66, m6: 31, m7: 97, m8: 14, m9: 54 },
    compositeScore: 75,
    rank: 16,
  },
  {
    id: 17,
    slug: 'coatue-management',
    name: 'Coatue',
    fund: 'Coatue Management',
    logo: 'C',
    domain: 'coatue.com',
    stage: 'Series B',
    sector: 'Consumer',
    geography: 'New York',
    aum: '$58B',
    founded: 1999,
    notablePortfolio: ['Snap', 'TikTok', 'DoorDash', 'Lyft', 'Instacart'],
    description: 'Crossover fund with deep consumer tech expertise and fast deployment.',
    metrics: { m1: 65, m2: 12, m3: 44, m4: 60, m5: 64, m6: 29, m7: 86, m8: 16, m9: 58 },
    compositeScore: 74,
    rank: 17,
  },
  {
    id: 18,
    slug: 'y-combinator',
    name: 'Y Combinator',
    fund: 'Y Combinator',
    logo: 'YC',
    domain: 'ycombinator.com',
    stage: 'Pre-Seed',
    sector: 'Generalist',
    geography: 'SF Bay Area',
    aum: '$500M',
    founded: 2005,
    notablePortfolio: ['Airbnb', 'Stripe', 'Dropbox', 'DoorDash', 'Coinbase'],
    description: 'The world\'s most influential accelerator; pre-seed batches twice per year.',
    metrics: { m1: 74, m2: 10, m3: 35, m4: 68, m5: 71, m6: 28, m7: 84, m8: 13, m9: 52 },
    compositeScore: 73,
    rank: 18,
  },
  {
    id: 19,
    slug: 'spark-capital',
    name: 'Spark Capital',
    fund: 'Spark Capital',
    logo: 'SC',
    domain: 'sparkcapital.com',
    stage: 'Seed',
    sector: 'Consumer',
    geography: 'Boston',
    aum: '$4B',
    founded: 2005,
    notablePortfolio: ['Twitter', 'Tumblr', 'Oculus', 'Slack', 'Wayfair'],
    description: 'Consumer-focused firm with roots in media and marketplace businesses.',
    metrics: { m1: 67, m2: 14, m3: 51, m4: 60, m5: 64, m6: 30, m7: 93, m8: 13, m9: 52 },
    compositeScore: 72,
    rank: 19,
  },
  {
    id: 20,
    slug: 'battery-ventures',
    name: 'Battery Ventures',
    fund: 'Battery Ventures',
    logo: 'BT',
    domain: 'battery.com',
    stage: 'Series A',
    sector: 'Infrastructure',
    geography: 'Boston',
    aum: '$13B',
    founded: 1983,
    notablePortfolio: ['Groupon', 'Angie\'s List', 'Marketo', 'Bazaarvoice', 'Gainsight'],
    description: 'Technology-focused firm with strength in infrastructure and applied tech.',
    metrics: { m1: 65, m2: 16, m3: 49, m4: 59, m5: 63, m6: 29, m7: 100, m8: 12, m9: 50 },
    compositeScore: 71,
    rank: 20,
  },
  {
    id: 21,
    slug: 'redpoint-ventures',
    name: 'Redpoint Ventures',
    fund: 'Redpoint Ventures',
    logo: 'R',
    domain: 'redpoint.com',
    stage: 'Seed',
    sector: 'Infrastructure',
    geography: 'SF Bay Area',
    aum: '$7B',
    founded: 1999,
    notablePortfolio: ['Netflix', 'Stripe', 'Heroku', 'Twilio', 'Snowflake'],
    description: 'Early-stage specialist with a strong infrastructure and developer-tools thesis.',
    metrics: { m1: 70, m2: 13, m3: 54, m4: 63, m5: 67, m6: 31, m7: 91, m8: 14, m9: 54 },
    compositeScore: 70,
    rank: 21,
  },
  {
    id: 22,
    slug: 'ribbit-capital',
    name: 'Ribbit Capital',
    fund: 'Ribbit Capital',
    logo: 'RC',
    domain: 'ribbitcap.com',
    stage: 'Series A',
    sector: 'Fintech',
    geography: 'SF Bay Area',
    aum: '$5B',
    founded: 2012,
    notablePortfolio: ['Robinhood', 'Coinbase', 'Credit Karma', 'Brex', 'Nubank'],
    description: 'Fintech-focused fund with global reach and deep financial services expertise.',
    metrics: { m1: 72, m2: 14, m3: 56, m4: 65, m5: 69, m6: 34, m7: 94, m8: 16, m9: 60 },
    compositeScore: 69,
    rank: 22,
  },
  {
    id: 23,
    slug: 'social-capital',
    name: 'Social Capital',
    fund: 'Social Capital',
    logo: 'SoC',
    domain: 'socialcapital.com',
    stage: 'Seed',
    sector: 'Healthcare',
    geography: 'SF Bay Area',
    aum: '$1.5B',
    founded: 2011,
    notablePortfolio: ['Slack', 'Box', 'SurveyMonkey', 'Yammer', 'Front'],
    description: 'Mission-driven fund focused on technology solving hard human problems.',
    metrics: { m1: 63, m2: 15, m3: 47, m4: 57, m5: 61, m6: 27, m7: 97, m8: 11, m9: 48 },
    compositeScore: 68,
    rank: 23,
  },
  {
    id: 24,
    slug: 'khosla-ventures',
    name: 'Khosla Ventures',
    fund: 'Khosla Ventures',
    logo: 'KV',
    domain: 'khoslaventures.com',
    stage: 'Seed',
    sector: 'Deep Tech',
    geography: 'SF Bay Area',
    aum: '$15B',
    founded: 2004,
    notablePortfolio: ['Square', 'DoorDash', 'OpenAI', 'Stripe', 'Instacart'],
    description: 'High-risk, high-reward early-stage fund focused on deep tech and moonshots.',
    metrics: { m1: 61, m2: 17, m3: 45, m4: 56, m5: 59, m6: 29, m7: 108, m8: 15, m9: 56 },
    compositeScore: 67,
    rank: 24,
  },
  {
    id: 25,
    slug: 'gv',
    name: 'GV',
    fund: 'GV (Google Ventures)',
    logo: 'GV',
    domain: 'gv.com',
    stage: 'Series A',
    sector: 'Healthcare',
    geography: 'SF Bay Area',
    aum: '$8B',
    founded: 2009,
    notablePortfolio: ['Uber', 'Slack', 'Flatiron Health', '23andMe', 'CrowdStrike'],
    description: 'Google\'s independent venture arm, known for design sprint methodology.',
    metrics: { m1: 64, m2: 15, m3: 48, m4: 58, m5: 62, m6: 30, m7: 96, m8: 13, m9: 51 },
    compositeScore: 66,
    rank: 25,
  },
];

export function getInvestorBySlug(slug) {
  return investors.find(i => i.slug === slug) || null;
}

export function getMetricBreakdown(investor, metricId) {
  const aumNum = parseInt(String(investor.aum).replace(/[^0-9]/g, ''), 10) || 1;
  const portcos = aumNum * 5 + 50;
  const value = investor.metrics[metricId];

  switch (metricId) {
    case 'm1':
    case 'm6':
    case 'm8': {
      const num = Math.round((value / 100) * portcos);
      return { text: `${num} / ${portcos} portcos` };
    }
    case 'm3':
    case 'm4':
    case 'm5': {
      const num = Math.round((value / 100) * portcos);
      return { text: `${num} / ${portcos} rounds` };
    }
    case 'm9': {
      const unicorns = Math.max(1, Math.round((investor.metrics.m8 / 100) * portcos));
      const num = Math.round((value / 100) * unicorns);
      return { text: `${num} / ${unicorns} unicorns` };
    }
    case 'm2':
      return { text: `Across ${portcos} rounds` };
    case 'm7': {
      const exits = Math.max(1, Math.round((investor.metrics.m6 / 100) * portcos));
      return { text: `Across ${exits} exits` };
    }
    default:
      return null;
  }
}

export function getFilteredInvestors({ stage, sector, geography, search, sortBy, sortDir }) {
  let result = [...investors];

  if (stage && stage !== 'All stages') {
    result = result.filter(i => i.stage === stage || i.stage === 'Multi-Stage');
  }
  if (sector && sector !== 'All sectors') {
    result = result.filter(i => i.sector === sector || i.sector === 'Generalist');
  }
  if (geography && geography !== 'All geographies') {
    result = result.filter(i => i.geography === geography);
  }
  if (search) {
    const q = search.toLowerCase();
    result = result.filter(i =>
      i.name.toLowerCase().includes(q) ||
      i.fund.toLowerCase().includes(q)
    );
  }
  if (sortBy && sortBy !== 'rank') {
    result.sort((a, b) => {
      const aVal = sortBy in a.metrics ? a.metrics[sortBy] : a[sortBy];
      const bVal = sortBy in b.metrics ? b.metrics[sortBy] : b[sortBy];
      // For velocity/time metrics, lower is better → invert
      const lowerIsBetter = ['m2', 'm7'].includes(sortBy);
      const diff = lowerIsBetter ? aVal - bVal : bVal - aVal;
      return sortDir === 'asc' ? -diff : diff;
    });
  }

  return result;
}
