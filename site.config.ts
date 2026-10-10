/**
 * Single source of flags and owner-supplied placeholders.
 *
 * Placeholders keep their square brackets until the owner replaces them, so an
 * unreplaced value is obvious on the page rather than silently shipping.
 */

export const siteConfig = {
  name: 'Vyom',
  /** Used for canonical URLs, sitemap.xml and Open Graph. */
  url: 'https://vyom.health',
  locale: 'en-IN',

  /** Shows the "Concept preview" bar sitewide. One flag, as agreed. */
  showNotice: true,

  /**
   * While false, every page emits <meta name="robots" content="noindex"> and
   * robots.txt disallows everything. Flip to true only when the site is ready
   * to be found.
   */
  indexable: false,

  /** Placeholders — replace the bracketed values. */
  email: '[YOUR EMAIL]',
  location: 'Gurugram, India',
  locationMono: 'GURUGRAM, INDIA',
} as const;

export type SiteConfig = typeof siteConfig;

/** True while a placeholder is still unreplaced. */
export function isPlaceholder(value: string): boolean {
  return value.startsWith('[') && value.endsWith(']');
}
