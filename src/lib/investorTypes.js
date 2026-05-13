import { investors } from '@/data/investors';

const ALL_TYPE = 'All investor type';

// Unique primaryType values, alphabetically sorted, prefixed with the "All" sentinel
// so the filter UI matches STAGES / SECTORS / GEOGRAPHIES conventions.
export const TYPES = [
  ALL_TYPE,
  ...Array.from(new Set(investors.map(i => i.primaryType).filter(Boolean))).sort(),
];

export const TYPE_SENTINEL = ALL_TYPE;

export function filterByType(list, types) {
  if (!types?.length) return list;
  const set = new Set(types);
  return list.filter(i => set.has(i.primaryType));
}
