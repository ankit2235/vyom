import type { Source } from './types';

/**
 * Every public source behind /intelligence. Each was opened and read by hand
 * on `retrievedOn`; bylines and dates are copied from the page itself.
 */
export const sources = [
  {
    id: 'toi-2026-05-25',
    outlet: 'The Times of India',
    title: 'After 5 deaths at Kota hospitals, Rajasthan bans childbirth drug TOCIN as sample fails potency test',
    url: 'https://timesofindia.indiatimes.com/city/jaipur/raj-bans-tocin-injection-after-sample-fails-quality-tests-3500-vials-seized-in-kota/articleshow/131313505.cms',
    kind: 'media',
    publishedOn: '2026-05-25',
    byline: 'TNN',
    retrievedOn: '2026-10-27',
  },
  {
    id: 'ie-2026-06-26',
    outlet: 'The Indian Express',
    title: '‘Spurious’ injections that ‘contained no oxytocin’: Rajasthan pharma distributor loses licence',
    url: 'https://indianexpress.com/article/india/rajasthan-kota-spurious-oxytocin-injections-pharma-license-maternal-deaths-10758736/',
    kind: 'media',
    publishedOn: '2026-06-26',
    byline: 'Parul Kulshrestha',
    retrievedOn: '2026-10-27',
  },
  {
    id: 'ie-2026-07-06',
    outlet: 'The Indian Express',
    title: '5 mothers died in one week. Kota hospital probe finds huge lapses, poor monitoring',
    url: 'https://indianexpress.com/article/health-wellness/rajasthan-maternal-deaths-kota-oxytocin-probe-10773003/',
    kind: 'media',
    publishedOn: '2026-07-06',
    byline: 'Anonna Dutt',
    retrievedOn: '2026-10-27',
  },
  {
    id: 'who-n5-2025',
    outlet: 'World Health Organization',
    title: 'Medical Product Alert N°5/2025: Substandard (contaminated) oral liquid medicines',
    url: 'https://www.who.int/news/item/13-10-2025-medical-product-alert-n-5-2025--substandard-%28contaminated%29-oral-liquid-medicines',
    kind: 'official',
    publishedOn: '2025-10-13',
    retrievedOn: '2026-10-27',
  },
  {
    id: 'who-n5-2025-pdf',
    outlet: 'World Health Organization',
    title: 'Medical Product Alert N°5/2025 (PDF, with annex of affected batches)',
    url: 'https://cdn.who.int/media/docs/default-source/substandard-and-falsified/n5_2025_syrup-medicines_en.pdf?sfvrsn=652770c2_7',
    kind: 'official',
    format: 'pdf',
    publishedOn: '2025-10-13',
    retrievedOn: '2026-10-27',
  },
] as const satisfies readonly Source[];

export type SourceId = (typeof sources)[number]['id'];

const byId = new Map<string, Source>(sources.map((source) => [source.id, source]));

export function getSource(id: string): Source {
  const source = byId.get(id);
  if (!source) throw new Error(`Unknown source: ${id}`);
  return source;
}
