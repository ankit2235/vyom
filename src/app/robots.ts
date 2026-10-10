import type { MetadataRoute } from 'next';
import { siteConfig } from '~/site.config';

// Required by output: 'export' — these are generated once at build time.
export const dynamic = 'force-static';

/** While indexable is false, disallow everything. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: siteConfig.indexable
      ? { userAgent: '*', allow: '/' }
      : { userAgent: '*', disallow: '/' },
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
